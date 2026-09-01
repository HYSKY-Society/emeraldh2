import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CheckCircle2, Lock, MapPin, Home, ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingConfirmation({ params }: { params: { id: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const booking = await prisma.booking.findUnique({ where: { id }, include: { station: true } });
  if (!booking || booking.memberId !== memberId) notFound();

  return (
    <main className="flex min-h-[100dvh] flex-col px-6 pb-10 pt-10" style={{ background: "var(--ground)" }}>
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <CheckCircle2 size={30} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">You&rsquo;re booked</h1>
        <p className="mt-1 text-sm text-ink-muted">{booking.station.title}</p>
      </div>

      {/* access code */}
      <div className="mt-6 overflow-hidden rounded-2xl p-6 text-center text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0b3f26,#0b8a4b)" }}>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">Your access code</p>
        <p className="mt-2 font-display text-5xl font-extrabold tracking-[0.2em] tabular">{booking.accessCode}</p>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-white/85">
          <Lock size={15} /> Door locked — held until you arrive
        </p>
      </div>

      {/* details */}
      <div className="mt-4 flex flex-col gap-2.5 rounded-2xl border border-[--border] bg-surface p-5 text-sm shadow-card">
        <Row k="Booking no." v={booking.bookingNo} mono />
        <Row k="Fuel" v={`${booking.fuelQtyKg} kg`} />
        <Row k="Paid" v={formatCurrency(booking.price)} />
        <Row k="When" v={formatDateTime(booking.scheduledAt)} />
        <p className="flex items-start gap-2 pt-1 text-ink-muted"><MapPin size={15} className="mt-0.5" /> {booking.station.address}</p>
      </div>

      <div className="mt-auto flex gap-3 pt-6">
        <Link href="/app/bookings" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[--border] bg-surface py-3 text-sm font-semibold text-ink-soft hover:bg-[--surface-2]">
          <ListChecks size={16} /> My bookings
        </Link>
        <Link href="/app/home" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          <Home size={16} /> Home
        </Link>
      </div>
    </main>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-muted">{k}</span>
      <span className={`font-medium text-ink ${mono ? "font-mono text-xs" : ""}`}>{v}</span>
    </div>
  );
}
