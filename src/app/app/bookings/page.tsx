import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ChevronLeft, Lock, Fuel } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const bookings = await prisma.booking.findMany({
    where: { memberId },
    include: { station: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <h1 className="mb-4 mt-3 font-display text-2xl font-bold text-ink">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[--border] bg-surface px-4 py-10 text-center text-sm text-ink-muted">
          No bookings yet. <Link href="/app/find" className="font-semibold text-brand-600">Find a station</Link> to reserve fuel.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {bookings.map((b) => (
            <Link key={b.id} href={`/app/bookings/${b.id}`} className="flex items-center gap-3 rounded-xl border border-[--border] bg-surface p-4 shadow-card transition hover:shadow-md">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Fuel size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-ink">{b.station.title}</p>
                <p className="text-xs text-ink-muted">{b.fuelQtyKg} kg · {formatCurrency(b.price)} · {formatDateTime(b.scheduledAt)}</p>
              </div>
              <div className="text-right">
                {b.accessCode && <p className="font-display text-lg font-bold tabular tracking-wider text-brand-600">{b.accessCode}</p>}
                {b.doorLocked && <p className="flex items-center justify-end gap-1 text-[10px] text-ink-muted"><Lock size={10} /> locked</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
