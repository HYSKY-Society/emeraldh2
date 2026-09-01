import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, LinkButton, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteNews } from "@/app/actions/crud";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const items = await prisma.newsMedia.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PageHeader
        title="News & Media"
        breadcrumb={["Home", "News Management"]}
        subtitle="Press pieces and media published to the public site."
        action={<LinkButton href="/admin/news/new"><Plus size={16} /> Add News/Media</LinkButton>}
      />
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No news yet" hint="Publish your first press or media item." />
        ) : (
          <Table>
            <thead><tr><Th>Title</Th><Th>Type</Th><Th>Status</Th><Th>Published</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id}>
                  <Td>
                    <div className="font-semibold text-ink">{n.title}</div>
                    {n.excerpt && <div className="max-w-md truncate text-xs text-ink-muted">{n.excerpt}</div>}
                  </Td>
                  <Td className="capitalize text-sm">{n.type}</Td>
                  <Td><StatusBadge status={n.status} /></Td>
                  <Td className="whitespace-nowrap text-sm">{formatDate(n.publishedAt)}</Td>
                  <Td>
                    <div className="flex justify-end">
                      <ConfirmButton action={deleteNews.bind(null, n.id)} confirmText={`Delete "${n.title}"?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
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
