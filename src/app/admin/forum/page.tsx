import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Table, Th, Td, StatusBadge, EmptyState, Field, Input, Textarea, Button } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { createForumCategory, deleteForumCategory } from "@/app/actions/crud";
import { Trash2, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const cats = await prisma.forumCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="Forum Categories" breadcrumb={["Home", "Membership", "Forum"]} subtitle="Categories for the members-only community forum." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Categories" />
            {cats.length === 0 ? (
              <EmptyState title="No categories" hint="Add a category to start the forum." />
            ) : (
              <Table>
                <thead><tr><Th>Name</Th><Th>Description</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
                <tbody>
                  {cats.map((c) => (
                    <tr key={c.id}>
                      <Td className="font-semibold text-ink">{c.name}</Td>
                      <Td className="max-w-sm text-sm text-ink-muted">{c.description || "—"}</Td>
                      <Td><StatusBadge status={c.status} /></Td>
                      <Td>
                        <div className="flex justify-end">
                          <ConfirmButton action={deleteForumCategory.bind(null, c.id)} confirmText={`Delete "${c.name}"?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
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
          <CardHeader title="Add a category" />
          <form action={createForumCategory} className="flex flex-col gap-3 p-5">
            <Field label="Name"><Input name="name" required placeholder="Station Safety" /></Field>
            <Field label="Description"><Textarea name="description" placeholder="What this category is about" /></Field>
            <Button type="submit"><Plus size={16} /> Add Category</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
