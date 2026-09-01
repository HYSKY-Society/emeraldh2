import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, EmptyState, Field, Input, Textarea, Button } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { createWebTraining, deleteWebTraining } from "@/app/actions/crud";
import { Trash2, Plus, GraduationCap, Video } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WebTrainingPage() {
  const items = await prisma.webTraining.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="Web Training" breadcrumb={["Home", "Membership", "Web Training"]} subtitle="Browser-based training modules members complete before/while using the network." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.length === 0 ? (
            <Card><EmptyState title="No modules" hint="Add a training module." /></Card>
          ) : (
            items.map((t) => (
              <Card key={t.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-display font-semibold text-ink"><GraduationCap size={16} className="text-brand-500" /> {t.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{t.body}</p>
                    {t.videoUrl && <p className="mt-1 flex items-center gap-1 text-xs text-h2blue-500"><Video size={12} /> {t.videoUrl}</p>}
                  </div>
                  <ConfirmButton action={deleteWebTraining.bind(null, t.id)} confirmText={`Delete "${t.title}"?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
                </div>
              </Card>
            ))
          )}
        </div>
        <Card className="self-start">
          <CardHeader title="Add a module" />
          <form action={createWebTraining} className="flex flex-col gap-3 p-5">
            <Field label="Title"><Input name="title" required placeholder="How to reserve fuel" /></Field>
            <Field label="Body"><Textarea name="body" placeholder="Module content" /></Field>
            <Field label="Video URL"><Input name="videoUrl" placeholder="https://…" /></Field>
            <Button type="submit"><Plus size={16} /> Add Module</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
