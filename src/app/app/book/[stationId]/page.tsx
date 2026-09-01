import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { createBooking } from "@/app/actions/booking";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, Wallet, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

const QUANTITIES = [1, 5, 10];

export default async function BookPage({ params }: { params: { stationId: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const stationId = Number(params.stationId);
  if (Number.isNaN(stationId)) notFound();

  const [station, member] = await Promise.all([
    prisma.station.findUnique({ where: { id: stationId } }),
    prisma.member.findUnique({ where: { id: memberId } }),
  ]);
  if (!station) notFound();
  if (station.status !== "active") redirect(`/app/stations/${stationId}`);

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href={`/app/stations/${stationId}`} className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Back
      </Link>

      <h1 className="mb-1 mt-4 font-display text-2xl font-bold text-ink">Reserve fuel</h1>
      <p className="text-sm text-ink-muted">{station.title} · {formatCurrency(station.pricePerKg)}/kg</p>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-[--border] bg-surface px-4 py-3 text-sm shadow-card">
        <span className="flex items-center gap-2 text-ink-soft"><Wallet size={15} className="text-brand-500" /> Balance</span>
        <span className="font-display font-bold text-ink">{formatCurrency(member?.walletBalance ?? 0)}</span>
      </div>

      <form action={createBooking} className="mt-4 flex flex-col gap-3">
        <input type="hidden" name="stationId" value={stationId} />
        <p className="text-sm font-medium text-ink-soft">How much hydrogen?</p>
        <div className="grid grid-cols-3 gap-3">
          {QUANTITIES.map((q, i) => (
            <label
              key={q}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-[--border] bg-surface p-4 shadow-card has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50 has-[:checked]:ring-1 has-[:checked]:ring-brand-400"
            >
              <input type="radio" name="qty" value={q} defaultChecked={i === QUANTITIES.length - 1} className="sr-only" />
              <span className="font-display text-lg font-bold text-ink">{q} kg</span>
              <span className="text-xs text-ink-muted">{formatCurrency(q * station.pricePerKg)}</span>
            </label>
          ))}
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-xl border border-[--border] bg-surface px-4 py-3 text-xs text-ink-muted shadow-card">
          <Lock size={15} className="mt-0.5 shrink-0 text-brand-500" />
          Booking locks the station door for you and gives you a personal 6-digit access code. Payment is drawn from your balance.
        </div>

        <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-lg transition hover:bg-brand-600">
          Confirm &amp; Lock the Door
        </button>
      </form>
    </main>
  );
}
