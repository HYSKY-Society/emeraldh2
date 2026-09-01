import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, LinkButton, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteStation } from "@/app/actions/stations";
import { formatCurrency } from "@/lib/utils";
import { Plus, Fuel, LayoutGrid, Trash2, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StationsPage() {
  const stations = await prisma.station.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <>
      <PageHeader
        title="Stations"
        breadcrumb={["Home", "App & Booking", "Stations"]}
        subtitle="Hydrogen fueling appliances in the network. Status drives the app map pins (green / amber / red)."
        action={
          <div className="flex gap-2">
            <LinkButton href="/admin/stations/dashboard" variant="outline"><LayoutGrid size={16} /> Dashboard</LinkButton>
            <LinkButton href="/admin/stations/new"><Plus size={16} /> Add Station</LinkButton>
          </div>
        }
      />

      <Card>
        {stations.length === 0 ? (
          <EmptyState title="No stations yet" hint="Add your first hydrogen station to get started." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Code</Th>
                <Th>Station</Th>
                <Th>Address</Th>
                <Th>Price/kg</Th>
                <Th>Bookings</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {stations.map((s) => (
                <tr key={s.id} className="hover:bg-[--surface-2]/50">
                  <Td className="font-mono text-xs">{s.code}</Td>
                  <Td>
                    <Link href={`/admin/stations/${s.id}`} className="flex items-center gap-2 font-semibold text-ink hover:text-brand-600">
                      <Fuel size={15} className="text-brand-500" /> {s.title}
                    </Link>
                  </Td>
                  <Td className="text-sm"><span className="flex items-center gap-1 text-ink-muted"><MapPin size={13} /> {s.address}</span></Td>
                  <Td className="tabular">{formatCurrency(s.pricePerKg)}</Td>
                  <Td className="tabular">{s._count.bookings}</Td>
                  <Td><StatusBadge status={s.status} /></Td>
                  <Td>
                    <div className="flex justify-end">
                      <ConfirmButton
                        action={deleteStation.bind(null, s.id)}
                        confirmText={`Delete ${s.title}? (Stations with bookings are set offline instead.)`}
                        className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </ConfirmButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
