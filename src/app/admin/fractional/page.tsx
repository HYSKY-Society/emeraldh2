import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteFractional } from "@/app/actions/crud";
import { formatDateTime } from "@/lib/utils";
import { Mail, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FractionalPage() {
  const rows = await prisma.fractionalSignup.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader
        title="Fractional Ownership Sign-ups"
        breadcrumb={["Home", "Membership", "Fractional Ownership"]}
        subtitle="People who registered interest in co-owning a hydrogen station."
      />
      <Card>
        {rows.length === 0 ? (
          <EmptyState title="No sign-ups yet" hint="Fractional ownership leads will appear here." />
        ) : (
          <Table>
            <thead><tr><Th>Name</Th><Th>Contact</Th><Th>Address</Th><Th>Requested</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <Td className="font-semibold text-ink">{r.name}</Td>
                  <Td className="text-sm"><div>{r.email}</div><div className="text-xs text-ink-muted">{r.phone}</div></Td>
                  <Td className="max-w-xs text-sm text-ink-muted">{r.address}</Td>
                  <Td className="whitespace-nowrap text-sm">{formatDateTime(r.createdAt)}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="rounded-md p-1.5 text-ink-muted hover:bg-[--surface-2] hover:text-brand-600"><Mail size={15} /></a>
                      )}
                      <ConfirmButton action={deleteFractional.bind(null, r.id)} confirmText={`Delete ${r.name}?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
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
