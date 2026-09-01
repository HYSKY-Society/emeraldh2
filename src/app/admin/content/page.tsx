import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, LinkButton, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteContent } from "@/app/actions/crud";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const items = await prisma.content.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader
        title="Content"
        breadcrumb={["Home", "Content Management"]}
        subtitle="CMS pages powering the public website."
        action={<LinkButton href="/admin/content/new"><Plus size={16} /> Add Content</LinkButton>}
      />
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No content yet" hint="Create your first page." />
        ) : (
          <Table>
            <thead><tr><Th>Title</Th><Th>Slug</Th><Th>Status</Th><Th>Created</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <Td className="font-semibold text-ink">{c.title}</Td>
                  <Td className="font-mono text-xs text-ink-muted">/{c.slug}</Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td className="whitespace-nowrap text-sm">{formatDate(c.createdAt)}</Td>
                  <Td>
                    <div className="flex justify-end">
                      <ConfirmButton action={deleteContent.bind(null, c.id)} confirmText={`Delete "${c.title}"?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
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
