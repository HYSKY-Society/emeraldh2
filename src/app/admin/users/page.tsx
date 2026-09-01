import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, Avatar, StatusBadge, LinkButton, EmptyState } from "@/components/ui";
import { ConfirmButton, ActionButton } from "@/components/ConfirmButton";
import { deleteMember, toggleMemberActive } from "@/app/actions/members";
import { formatDate } from "@/lib/utils";
import { UserPlus, Search, Power, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim();
  const where = q
    ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { membershipCode: { contains: q } }] }
    : {};
  const members = await prisma.member.findMany({ where, orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Members"
        breadcrumb={["Home", "Members"]}
        subtitle={`${members.length} member${members.length === 1 ? "" : "s"} in the network.`}
        action={
          <LinkButton href="/admin/users/new">
            <UserPlus size={16} /> Add Member
          </LinkButton>
        }
      />

      <Card>
        <div className="flex items-center gap-2 border-b border-[--border] px-4 py-3">
          <form className="relative w-full max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email or code…"
              className="w-full rounded-lg border border-[--border] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-400"
            />
          </form>
        </div>

        {members.length === 0 ? (
          <EmptyState title="No members found" hint="Try a different search, or add a new member." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Member</Th>
                <Th>Code</Th>
                <Th>Location</Th>
                <Th>Joined</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[--surface-2]/50">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} size={34} />
                      <div>
                        <Link href={`/admin/users/${m.id}`} className="font-semibold text-ink hover:text-brand-600">{m.name}</Link>
                        <div className="text-xs text-ink-muted">{m.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{m.membershipCode}</Td>
                  <Td className="text-sm">{[m.city, m.state].filter(Boolean).join(", ") || "—"}</Td>
                  <Td className="whitespace-nowrap text-sm">{formatDate(m.createdAt)}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      <StatusBadge status={m.isApproved ? "approved" : "pending"} />
                      {!m.isActive && <StatusBadge status="inactive" />}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <ActionButton
                        action={toggleMemberActive.bind(null, m.id, !m.isActive)}
                        className="rounded-md p-1.5 text-ink-muted hover:bg-[--surface-2] hover:text-amber-600"
                      >
                        <Power size={15} />
                      </ActionButton>
                      <ConfirmButton
                        action={deleteMember.bind(null, m.id)}
                        confirmText={`Delete ${m.name}? This removes their bookings too.`}
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
