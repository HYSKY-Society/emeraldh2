import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, EmptyState } from "@/components/ui";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const [txns, agg] = await Promise.all([
    prisma.transaction.findMany({
      include: { booking: { include: { member: true, station: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "success" } }),
  ]);

  return (
    <>
      <PageHeader title="Transactions History" breadcrumb={["Home", "App & Booking", "Transactions"]} subtitle="Settled payments against fuel bookings." />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="font-mono text-[11px] uppercase text-ink-muted">Total Settled</p>
          <p className="mt-1 flex items-center gap-2 font-display text-2xl font-bold text-ink"><Wallet size={20} className="text-brand-500" /> {formatCurrency(agg._sum.amount ?? 0)}</p>
        </Card>
        <Card className="p-5"><p className="font-mono text-[11px] uppercase text-ink-muted">Transactions</p><p className="mt-1 font-display text-2xl font-bold text-ink">{txns.length}</p></Card>
      </div>

      <Card>
        {txns.length === 0 ? (
          <EmptyState title="No transactions" hint="Paid bookings will appear here." />
        ) : (
          <Table>
            <thead>
              <tr><Th>Reference</Th><Th>Member</Th><Th>Station</Th><Th>Method</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th></tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} className="hover:bg-[--surface-2]/50">
                  <Td className="font-mono text-xs">{t.reference || `#${t.id}`}</Td>
                  <Td><Link href={`/admin/users/${t.booking.memberId}`} className="font-medium text-ink hover:text-brand-600">{t.booking.member.name}</Link></Td>
                  <Td className="text-ink-soft">{t.booking.station.title}</Td>
                  <Td className="capitalize">{t.method || "—"}</Td>
                  <Td className="tabular font-semibold">{formatCurrency(t.amount)}</Td>
                  <Td><StatusBadge status={t.status} /></Td>
                  <Td className="whitespace-nowrap text-sm">{formatDateTime(t.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
