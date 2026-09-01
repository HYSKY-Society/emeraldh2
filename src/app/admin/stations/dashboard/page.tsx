import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, LinkButton } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Fuel, List } from "lucide-react";

export const dynamic = "force-dynamic";

const PIN: Record<string, { ring: string; dot: string; label: string }> = {
  active: { ring: "ring-emerald-500/30", dot: "bg-emerald-500", label: "Active" },
  maintenance: { ring: "ring-amber-500/30", dot: "bg-amber-500", label: "Coming soon" },
  offline: { ring: "ring-red-500/30", dot: "bg-red-500", label: "Offline" },
};

export default async function StationDashboard() {
  const stations = await prisma.station.findMany({ orderBy: { id: "asc" }, include: { bookings: true } });

  const totals = {
    active: stations.filter((s) => s.status === "active").length,
    kg: stations.reduce((a, s) => a + s.bookings.reduce((x, b) => x + b.fuelQtyKg, 0), 0),
    revenue: stations.reduce((a, s) => a + s.bookings.reduce((x, b) => x + (b.paymentStatus === "paid" ? b.price : 0), 0), 0),
  };

  return (
    <>
      <PageHeader
        title="Station Dashboard"
        breadcrumb={["Home", "Stations", "Dashboard"]}
        subtitle="Network health at a glance — the same green / amber / red states drivers see on the app map."
        action={<LinkButton href="/admin/stations" variant="outline"><List size={16} /> Station List</LinkButton>}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="font-mono text-[11px] uppercase text-ink-muted">Active Stations</p><p className="mt-1 font-display text-3xl font-extrabold text-ink">{totals.active}<span className="text-lg text-ink-muted">/{stations.length}</span></p></Card>
        <Card className="p-5"><p className="font-mono text-[11px] uppercase text-ink-muted">Fuel Dispensed</p><p className="mt-1 font-display text-3xl font-extrabold text-ink tabular">{totals.kg.toFixed(0)} <span className="text-lg text-ink-muted">kg</span></p></Card>
        <Card className="p-5"><p className="font-mono text-[11px] uppercase text-ink-muted">Fuel Revenue</p><p className="mt-1 font-display text-3xl font-extrabold text-ink tabular">{formatCurrency(totals.revenue)}</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((s) => {
          const pin = PIN[s.status] ?? PIN.offline;
          const kg = s.bookings.reduce((x, b) => x + b.fuelQtyKg, 0);
          return (
            <Link key={s.id} href={`/admin/stations/${s.id}`} className={`rounded-xl border border-[--border] bg-surface p-5 shadow-card ring-1 ${pin.ring} transition hover:shadow-md`}>
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><Fuel size={18} /></span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                  <span className={`h-2 w-2 rounded-full ${pin.dot}`} /> {pin.label}
                </span>
              </div>
              <p className="mt-3 font-display text-base font-bold text-ink">{s.title}</p>
              <p className="font-mono text-[11px] text-ink-muted">{s.code}</p>
              <p className="mt-1 line-clamp-1 text-sm text-ink-muted">{s.address}</p>
              <div className="mt-3 flex items-center justify-between border-t border-[--border] pt-3 text-sm">
                <span className="text-ink-muted">{s.bookings.length} bookings</span>
                <span className="tabular font-semibold text-ink">{kg.toFixed(0)} kg · {formatCurrency(s.pricePerKg)}/kg</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
