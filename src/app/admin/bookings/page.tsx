import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, EmptyState } from "@/components/ui";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
const PER_PAGE = 20;

export default async function BookingsPage({ searchParams }: { searchParams: { page?: string; status?: string } }) {
  const page = Math.max(1, Number(searchParams.page || 1));
  const status = searchParams.status;
  const where = status ? { paymentStatus: status } : {};

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: { member: true, station: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const filters = [
    { key: undefined, label: "All" },
    { key: "pending", label: "Pending" },
    { key: "paid", label: "Paid" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <>
      <PageHeader title="Booking History" breadcrumb={["Home", "App & Booking", "Bookings"]} subtitle={`${total} fuel reservations across the network.`} />

      <Card>
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[--border] px-4 py-3">
          {filters.map((f) => {
            const active = status === f.key || (!status && !f.key);
            return (
              <Link
                key={f.label}
                href={`/admin/bookings${f.key ? `?status=${f.key}` : ""}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-brand-500 text-white" : "bg-[--surface-2] text-ink-soft hover:bg-brand-50"}`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {bookings.length === 0 ? (
          <EmptyState title="No bookings" hint="No fuel reservations match this filter." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Booking No.</Th>
                <Th>Member</Th>
                <Th>Station</Th>
                <Th>Scheduled</Th>
                <Th>Qty</Th>
                <Th>Price</Th>
                <Th>Payment</Th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[--surface-2]/50">
                  <Td className="font-mono text-xs">{b.bookingNo}</Td>
                  <Td><Link href={`/admin/users/${b.memberId}`} className="font-medium text-ink hover:text-brand-600">{b.member.name}</Link></Td>
                  <Td><Link href={`/admin/stations/${b.stationId}`} className="text-ink-soft hover:text-brand-600">{b.station.title}</Link></Td>
                  <Td className="whitespace-nowrap text-sm">{formatDateTime(b.scheduledAt)}</Td>
                  <Td className="tabular">{b.fuelQtyKg} kg</Td>
                  <Td className="tabular">{formatCurrency(b.price)}</Td>
                  <Td><StatusBadge status={b.paymentStatus} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-[--border] px-4 py-3 text-sm">
            <span className="text-ink-muted">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <Link
                href={`/admin/bookings?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page - 1) })}`}
                className={`rounded-lg border border-[--border] px-3 py-1.5 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-[--surface-2]"}`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/bookings?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page + 1) })}`}
                className={`rounded-lg border border-[--border] px-3 py-1.5 ${page >= pages ? "pointer-events-none opacity-40" : "hover:bg-[--surface-2]"}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
