"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { sendPushToMember } from "@/lib/push";

async function requireMember() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  return Number(session.sub);
}

function sixDigit() {
  return String(100000 + Math.floor(Math.random() * 900000));
}
function bookingNumber() {
  return String(Date.now()) + String(100 + Math.floor(Math.random() * 900));
}

/* ---------------- Favorites ---------------- */
export async function toggleFavorite(stationId: number) {
  const memberId = await requireMember();
  const existing = await prisma.favorite.findUnique({
    where: { memberId_stationId: { memberId, stationId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { memberId, stationId } });
  }
  revalidatePath(`/app/stations/${stationId}`);
  revalidatePath("/app/find");
}

/* ---------------- Wallet ---------------- */
export async function topUpWallet(formData: FormData) {
  const memberId = await requireMember();
  const amount = Number(formData.get("amount") || 0);
  if (amount <= 0) return;
  await prisma.member.update({ where: { id: memberId }, data: { walletBalance: { increment: amount } } });
  revalidatePath("/app/wallet");
  revalidatePath("/app/home");
}

/* ---------------- Booking ---------------- */
export async function createBooking(formData: FormData) {
  const memberId = await requireMember();
  const stationId = Number(formData.get("stationId"));
  const qty = Math.max(1, Number(formData.get("qty") || 1));

  const [station, member] = await Promise.all([
    prisma.station.findUnique({ where: { id: stationId } }),
    prisma.member.findUnique({ where: { id: memberId } }),
  ]);
  if (!station || !member) redirect("/app/find");
  if (station.status !== "active") redirect(`/app/stations/${stationId}?err=inactive`);

  const price = qty * station.pricePerKg;

  // Not enough balance → send to wallet to top up.
  if (member.walletBalance < price) {
    redirect(`/app/wallet?need=${price}&station=${stationId}&qty=${qty}`);
  }

  // Deduct, create booking with a personal 6-digit code, lock the door —
  // atomically, so a dropped connection can never leave a partial booking.
  const accessCode = sixDigit();
  const booking = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.create({
      data: {
        bookingNo: bookingNumber(),
        memberId,
        stationId,
        fuelQtyKg: qty,
        price,
        scheduledAt: new Date(),
        paymentStatus: "paid",
        accessCode,
        doorLocked: true,
      },
    });
    await tx.member.update({ where: { id: memberId }, data: { walletBalance: { decrement: price } } });
    await tx.transaction.create({
      data: { bookingId: b.id, amount: price, status: "success", method: "wallet", reference: `TXN${accessCode}` },
    });
    return b;
  });

  // Notify the driver (web push, if subscribed) — never let this fail the booking.
  try {
    await sendPushToMember(memberId, {
      title: "Fuel reserved 🔒",
      body: `${station.title}: door locked for you. Access code ${accessCode}.`,
      url: `/app/bookings/${booking.id}`,
    });
  } catch {
    /* push is best-effort */
  }

  revalidatePath("/app/home");
  redirect(`/app/bookings/${booking.id}`);
}

/* ---------------- Web push subscription ---------------- */
export async function savePushSubscription(sub: { endpoint: string; p256dh: string; auth: string }) {
  const memberId = await requireMember();
  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: { memberId, p256dh: sub.p256dh, auth: sub.auth },
    create: { memberId, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
  });
  await sendPushToMember(memberId, {
    title: "Notifications on ✅",
    body: "We'll ping you about bookings, door unlocks and station availability.",
    url: "/app/home",
  });
}
