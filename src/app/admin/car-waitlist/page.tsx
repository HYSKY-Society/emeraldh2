import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteCarInterest } from "@/app/actions/crud";
import { formatDate } from "@/lib/utils";
import { Mail, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CarWaitlistPage() {
  const rows = await prisma.carInterest.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader
        title="Car Waitlist"
        breadcrumb={["Home", "Membership", "Sign Up For A Car"]}
        subtitle="Wait-list of members interested in buying a hydrogen fuel-cell vehicle — used to decide where to place stations."
      />
      <Card>
        {rows.length === 0 ? (
          <EmptyState title="No sign-ups yet" hint="Car wait-list entries will appear here." />
        ) : (
          <Table>
            <thead><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>City</Th><Th>Requested</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <Td className="font-semibold text-ink">{r.name}</Td>
                  <Td className="text-sm">{r.email}</Td>
                  <Td className="text-sm">{r.phone || "—"}</Td>
                  <Td className="text-sm">{r.city || "—"}</Td>
                  <Td className="whitespace-nowrap text-sm">{formatDate(r.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      {r.email && <a href={`mailto:${r.email}`} className="rounded-md p-1.5 text-ink-muted hover:bg-[--surface-2] hover:text-brand-600"><Mail size={15} /></a>}
                      <ConfirmButton action={deleteCarInterest.bind(null, r.id)} confirmText={`Delete ${r.name}?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
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
