import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Avatar, StatusBadge, Table, Th, Td, LinkButton } from "@/components/ui";
import { ActionButton, ConfirmButton } from "@/components/ConfirmButton";
import { approveMember, toggleMemberActive, deleteMember } from "@/app/actions/members";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Mail, Phone, MapPin, Check, Power, Trash2, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MemberProfile({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      referrals: true,
      referredBy: true,
      bookings: { include: { station: true }, orderBy: { scheduledAt: "desc" }, take: 10 },
    },
  });
  if (!member) notFound();

  return (
    <>
      <PageHeader
        title={member.name}
        breadcrumb={["Home", "Members", "Profile"]}
        action={
          <div className="flex gap-2">
            {!member.isApproved && (
              <ActionButton action={approveMember.bind(null, member.id)} className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                <Check size={16} /> Approve
              </ActionButton>
            )}
            <ActionButton action={toggleMemberActive.bind(null, member.id, !member.isActive)} className="inline-flex items-center gap-1 rounded-lg border border-[--border] bg-white px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-[--surface-2]">
              <Power size={16} /> {member.isActive ? "Deactivate" : "Activate"}
            </ActionButton>
            <ConfirmButton action={deleteMember.bind(null, member.id)} confirmText={`Delete ${member.name}?`} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              <Trash2 size={16} /> Delete
            </ConfirmButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* profile card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center gap-3 border-b border-[--border] px-5 py-6 text-center">
            <Avatar name={member.name} size={72} />
            <div>
              <p className="font-display text-lg font-bold text-ink">{member.name}</p>
              <p className="text-sm text-ink-muted">Membership #{member.membershipCode}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={member.isApproved ? "approved" : "pending"} />
              <StatusBadge status={member.isActive ? "active" : "inactive"} />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 px-5 py-4 text-sm">
            <p className="flex items-center gap-2 text-ink-soft"><Mail size={15} className="text-ink-muted" /> {member.email}</p>
            <p className="flex items-center gap-2 text-ink-soft"><Phone size={15} className="text-ink-muted" /> {member.phone || "—"}</p>
            <p className="flex items-start gap-2 text-ink-soft"><MapPin size={15} className="mt-0.5 text-ink-muted" /> {[member.addressLine, member.city, member.state, member.zip, member.country].filter(Boolean).join(", ") || "—"}</p>
            <p className="mt-1 text-xs text-ink-muted">Member since {formatDate(member.createdAt)}</p>
          </div>
        </Card>

        {/* right column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <p className="font-mono text-[11px] uppercase text-ink-muted">Referrals</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{member.referrals.length}</p>
            </Card>
            <Card className="p-4">
              <p className="font-mono text-[11px] uppercase text-ink-muted">Referral Earnings</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{formatCurrency(member.referralEarnings)}</p>
            </Card>
            <Card className="p-4">
              <p className="font-mono text-[11px] uppercase text-ink-muted">Bookings</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{member.bookings.length}</p>
            </Card>
          </div>

          <Card>
            <CardHeader title="Vehicle" />
            <div className="px-5 py-4 text-sm text-ink-soft">
              {member.hasVehicle ? (
                <p>{[member.vehicleYear, member.vehicleMake, member.vehicleModel].filter(Boolean).join(" ") || "Registered hydrogen vehicle"}</p>
              ) : (
                <p className="text-ink-muted">No vehicle purchased from the Emerald H2 network or outside of it.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent Bookings" action={<Link href="/admin/bookings" className="text-xs font-semibold text-brand-600 hover:underline">All bookings</Link>} />
            {member.bookings.length === 0 ? (
              <div className="px-5 py-6 text-sm text-ink-muted">No bookings yet.</div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Booking</Th>
                    <Th>Station</Th>
                    <Th>When</Th>
                    <Th>Qty</Th>
                    <Th>Price</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {member.bookings.map((b) => (
                    <tr key={b.id}>
                      <Td className="font-mono text-xs">{b.bookingNo}</Td>
                      <Td>{b.station.title}</Td>
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

          {member.referredBy && (
            <Card className="p-4">
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <Gift size={15} className="text-brand-500" /> Referred by{" "}
                <Link href={`/admin/users/${member.referredBy.id}`} className="font-semibold text-brand-600 hover:underline">{member.referredBy.name}</Link>
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
