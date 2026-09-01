import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Table, Th, Td, StatusBadge, EmptyState, Field, Input, Button } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { createDonation, deleteDonation } from "@/app/actions/crud";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, Plus, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DonationsPage() {
  const [rows, agg] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.donation.aggregate({ _sum: { amount: true } }),
  ]);

  return (
    <>
      <PageHeader title="Donations" breadcrumb={["Home", "Donations"]} subtitle="Contributions to the network. Members can donate to support station rollout." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="All donations" action={<span className="flex items-center gap-1.5 text-sm font-semibold text-brand-600"><HeartHandshake size={15} /> {formatCurrency(agg._sum.amount ?? 0)} total</span>} />
            {rows.length === 0 ? (
              <EmptyState title="No donations yet" hint="Record a donation using the form." />
            ) : (
              <Table>
                <thead><tr><Th>Donor</Th><Th>Email</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th><Th className="text-right">Actions</Th></tr></thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id}>
                      <Td className="font-semibold text-ink">{d.name}</Td>
                      <Td className="text-sm">{d.email || "—"}</Td>
                      <Td className="tabular font-semibold">{formatCurrency(d.amount)}</Td>
                      <Td><StatusBadge status={d.status} /></Td>
                      <Td className="whitespace-nowrap text-sm">{formatDate(d.createdAt)}</Td>
                      <Td>
                        <div className="flex justify-end">
                          <ConfirmButton action={deleteDonation.bind(null, d.id)} confirmText={`Delete donation from ${d.name}?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        <Card className="self-start">
          <CardHeader title="Record a donation" />
          <form action={createDonation} className="flex flex-col gap-3 p-5">
            <Field label="Donor name"><Input name="name" required placeholder="Jane Supporter" /></Field>
            <Field label="Email"><Input name="email" type="email" placeholder="jane@example.com" /></Field>
            <Field label="Amount (USD)"><Input name="amount" type="number" step="1" required placeholder="25" /></Field>
            <Field label="Message"><Input name="message" placeholder="Optional note" /></Field>
            <Button type="submit"><Plus size={16} /> Add Donation</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
