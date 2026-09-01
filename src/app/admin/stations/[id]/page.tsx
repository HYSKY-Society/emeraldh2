import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, StatusBadge, Table, Th, Td } from "@/components/ui";
import { ActionButton } from "@/components/ConfirmButton";
import { updateStationStatus } from "@/app/actions/stations";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { MapPin, Fuel, DollarSign, Gauge } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Coming soon" },
  { value: "offline", label: "Offline" },
];

export default async function StationDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();
  const station = await prisma.station.findUnique({
    where: { id },
    include: { bookings: { include: { member: true }, orderBy: { scheduledAt: "desc" }, take: 15 } },
  });
  if (!station) notFound();

  const kg = station.bookings.reduce((a, b) => a + b.fuelQtyKg, 0);
  const revenue = station.bookings.reduce((a, b) => a + (b.paymentStatus === "paid" ? b.price : 0), 0);

  return (
    <>
      <PageHeader
        title={station.title}
        breadcrumb={["Home", "Stations", station.code]}
        subtitle={station.address}
        action={<StatusBadge status={station.status} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card className="p-5">
            <p className="font-mono text-[11px] uppercase text-ink-muted">Station code</p>
            <p className="font-mono text-sm text-ink">{station.code}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-ink-soft">
              <p className="flex items-center gap-2"><MapPin size={15} className="text-ink-muted" /> {station.address}</p>
              <p className="flex items-center gap-2"><DollarSign size={15} className="text-ink-muted" /> {formatCurrency(station.pricePerKg)} / kg</p>
              <p className="flex items-center gap-2"><Gauge size={15} className="text-ink-muted" /> Capacity {station.capacityKg} kg</p>
            </div>
            {station.description && <p className="mt-3 border-t border-[--border] pt-3 text-sm text-ink-muted">{station.description}</p>}
          </Card>

          <Card>
            <CardHeader title="Set status" />
            <div className="flex flex-col gap-2 p-4">
              {STATUSES.map((st) => (
                <ActionButton
                  key={st.value}
                  action={updateStationStatus.bind(null, station.id, st.value)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    station.status === st.value ? "border-brand-400 bg-brand-50 text-brand-700" : "border-[--border] bg-white text-ink-soft hover:bg-[--surface-2]"
                  }`}
                >
                  {st.label}
                  {station.status === st.value && <span className="text-xs">current</span>}
                </ActionButton>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4"><p className="font-mono text-[11px] uppercase text-ink-muted">Fuel</p><p className="mt-1 font-display text-xl font-bold tabular text-ink">{kg.toFixed(0)} kg</p></Card>
            <Card className="p-4"><p className="font-mono text-[11px] uppercase text-ink-muted">Revenue</p><p className="mt-1 font-display text-xl font-bold tabular text-ink">{formatCurrency(revenue)}</p></Card>
          </div>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader title="Bookings at this station" action={<Link href="/admin/bookings" className="text-xs font-semibold text-brand-600 hover:underline">All bookings</Link>} />
          {station.bookings.length === 0 ? (
            <div className="px-5 py-6 text-sm text-ink-muted">No bookings yet.</div>
          ) : (
            <Table>
              <thead>
                <tr><Th>Booking</Th><Th>Member</Th><Th>When</Th><Th>Qty</Th><Th>Price</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {station.bookings.map((b) => (
                  <tr key={b.id}>
                    <Td className="font-mono text-xs">{b.bookingNo}</Td>
                    <Td><Link href={`/admin/users/${b.memberId}`} className="font-medium text-ink hover:text-brand-600">{b.member.name}</Link></Td>
                    <Td className="whitespace-nowrap text-sm">{formatDateTime(b.scheduledAt)}</Td>
                    <Td className="tabular">{b.fuelQtyKg} kg</Td>
                    <Td className="tabular">{formatCurrency(b.price)}</Td>
                    <Td><StatusBadge status={b.paymentStatus} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
}
