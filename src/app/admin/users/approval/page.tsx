import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, Avatar, EmptyState } from "@/components/ui";
import { ActionButton, ConfirmButton } from "@/components/ConfirmButton";
import { approveMember, deleteMember } from "@/app/actions/members";
import { formatDate } from "@/lib/utils";
import { Check, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApprovalPage() {
  const pending = await prisma.member.findMany({ where: { isApproved: false }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Approval Queue"
        breadcrumb={["Home", "Members", "Approval"]}
        subtitle="New members awaiting activation before they can complete safety training and book fuel."
      />

      <Card>
        {pending.length === 0 ? (
          <EmptyState title="All caught up" hint="No members are waiting for approval." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Member</Th>
                <Th>Contact</Th>
                <Th>Requested</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pending.map((m) => (
                <tr key={m.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} size={34} />
                      <Link href={`/admin/users/${m.id}`} className="font-semibold text-ink hover:text-brand-600">{m.name}</Link>
                    </div>
                  </Td>
                  <Td className="text-sm">
                    <div>{m.email}</div>
                    <div className="text-xs text-ink-muted">{m.phone || "—"}</div>
                  </Td>
                  <Td className="whitespace-nowrap text-sm">{formatDate(m.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        action={approveMember.bind(null, m.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                      >
                        <Check size={14} /> Approve
                      </ActionButton>
                      <ConfirmButton
                        action={deleteMember.bind(null, m.id)}
                        confirmText={`Reject and delete ${m.name}?`}
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
