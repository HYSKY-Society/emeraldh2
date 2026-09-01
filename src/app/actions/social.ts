"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { sendPushToMember } from "@/lib/push";

async function requireMember() {
  const s = await getMemberSession();
  if (!s) redirect("/app/signin");
  return Number(s.sub);
}

/* ---------------- Events ---------------- */
export async function rsvpEvent(eventId: number) {
  const memberId = await requireMember();
  const existing = await prisma.eventRSVP.findUnique({ where: { eventId_memberId: { eventId, memberId } } });
  if (existing) {
    await prisma.eventRSVP.delete({ where: { id: existing.id } });
  } else {
    await prisma.eventRSVP.create({ data: { eventId, memberId } });
  }
  revalidatePath("/app/events");
}

/* ---------------- Direct messages ---------------- */
export async function sendMessage(recipientId: number, formData: FormData) {
  const senderId = await requireMember();
  const body = String(formData.get("body") || "").trim();
  if (!body || recipientId === senderId) return;

  await prisma.message.create({ data: { senderId, recipientId, body: body.slice(0, 2000) } });
  const sender = await prisma.member.findUnique({ where: { id: senderId }, select: { name: true } });
  await prisma.notification.create({
    data: {
      memberId: recipientId,
      type: "message",
      title: `New message from ${sender?.name ?? "a member"}`,
      body: body.slice(0, 120),
      url: `/app/messages/${senderId}`,
    },
  });
  try {
    await sendPushToMember(recipientId, {
      title: `${sender?.name ?? "New"} messaged you`,
      body: body.slice(0, 120),
      url: `/app/messages/${senderId}`,
    });
  } catch {
    /* best-effort */
  }
  revalidatePath(`/app/messages/${recipientId}`);
  revalidatePath("/app/messages");
}

/* ---------------- Notifications ---------------- */
export async function markNotificationsRead() {
  const memberId = await requireMember();
  await prisma.notification.updateMany({ where: { memberId, read: false }, data: { read: true } });
  revalidatePath("/app/notifications");
  revalidatePath("/app/home");
}
