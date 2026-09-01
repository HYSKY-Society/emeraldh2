import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardHeader, PageHeader, Avatar, StatusBadge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Fuel, CalendarCheck, Wallet, ArrowRight, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

function Stat({ icon: Icon, label, value, href, accent }: { icon: any; label: string; value: string; href: string; accent: string }) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-xl border border-[--border] bg-surface p-5 shadow-card transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular text-ink">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: accent + "1a", color: accent }}>
          <Icon size={20} />
        </span>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink-muted group-hover:text-brand-600">
        View all <ArrowRight size={13} />
      </span>
    </Link>
  );
}

export default async function DashboardPage() {
  const [memberCount, activeStations, bookingCount, paidAgg, latestMembers, recentCars, fractional, recentBookings] = await Promise.all([
    prisma.member.count(),
    prisma.station.count({ where: { status: "active" } }),
    prisma.booking.count(),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "success" } }),
    prisma.member.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.carInterest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.fractionalSignup.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { member: true, station: true } }),
  ]);

  const revenue = paidAgg._sum.amount ?? 0;

  return (
    <>
      <PageHeader title="Dashboard" breadcrumb={["Home", "Dashboard"]} subtitle="Network activity at a glance — members, stations, bookings and fuel revenue." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total Members" value={String(memberCount)} href="/admin/users" accent="#0b8a4b" />
        <Stat icon={Fuel} label="Active Stations" value={String(activeStations)} href="/admin/stations" accent="#1877a8" />
        <Stat icon={CalendarCheck} label="Bookings" value={String(bookingCount)} href="/admin/bookings" accent="#7a5cff" />
        <Stat icon={Wallet} label="Fuel Revenue" value={formatCurrency(revenue)} href="/admin/transactions" accent="#b77816" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Latest members */}
        <Card className="lg:col-span-2">
          <CardHeader title="Latest Members" action={<Link href="/admin/users" className="text-xs font-semibold text-brand-600 hover:underline">View all</Link>} />
          <ul className="divide-y divide-[--border]">
            {latestMembers.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={m.name} />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/users/${m.id}`} className="block truncate text-sm font-semibold text-ink hover:text-brand-600">{m.name}</Link>
                  <span className="block truncate text-xs text-ink-muted">{m.email}</span>
                </div>
                <div className="hidden text-right sm:block">
                  <span className="block font-mono text-xs text-ink-muted">{m.membershipCode}</span>
                  <span className="text-xs text-ink-muted">{formatDate(m.createdAt)}</span>
                </div>
                <StatusBadge status={m.isApproved ? "approved" : "pending"} />
              </li>
            ))}
          </ul>
        </Card>

        {/* side lists */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Car Waitlist" action={<Link href="/admin/car-waitlist" className="text-xs font-semibold text-brand-600 hover:underline">All</Link>} />
            <ul className="divide-y divide-[--border]">
              {recentCars.map((c) => (
                <li key={c.id} className="px-5 py-2.5">
                  <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                  <p className="truncate text-xs text-ink-muted">{c.email}{c.city ? ` · ${c.city}` : ""}</p>
                </li>
              ))}
              {recentCars.length === 0 && <li className="px-5 py-4 text-sm text-ink-muted">No sign-ups yet.</li>}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Fractional Ownership" action={<Link href="/admin/fractional" className="text-xs font-semibold text-brand-600 hover:underline">All</Link>} />
            <ul className="divide-y divide-[--border]">
              {fractional.map((f) => (
                <li key={f.id} className="px-5 py-2.5">
                  <p className="truncate text-sm font-medium text-ink">{f.name}</p>
                  <p className="truncate text-xs text-ink-muted">{formatDate(f.createdAt)}</p>
                </li>
              ))}
              {fractional.length === 0 && <li className="px-5 py-4 text-sm text-ink-muted">No sign-ups yet.</li>}
            </ul>
          </Card>
        </div>
      </div>

      {/* recent bookings */}
      <Card className="mt-6">
        <CardHeader
          title="Recent Bookings"
          action={
            <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
              <TrendingUp size={13} className="text-brand-500" /> live fuel reservations
            </span>
          }
        />
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-left font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-2.5">Booking</th>
                <th className="px-5 py-2.5">Member</th>
                <th className="px-5 py-2.5">Station</th>
                <th className="px-5 py-2.5">Qty</th>
                <th className="px-5 py-2.5">Price</th>
                <th className="px-5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-[--border] last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-ink-muted">{b.bookingNo}</td>
                  <td className="px-5 py-3 font-medium text-ink">{b.member.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{b.station.title}</td>
                  <td className="px-5 py-3 tabular">{b.fuelQtyKg} kg</td>
                  <td className="px-5 py-3 tabular">{formatCurrency(b.price)}</td>
                  <td className="px-5 py-3"><StatusBadge status={b.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
