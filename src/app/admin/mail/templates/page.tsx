import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, EmptyState, Field, Input, Textarea, Button } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { createMailTemplate, deleteMailTemplate } from "@/app/actions/crud";
import { Trash2, Plus, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await prisma.mailTemplate.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <>
      <PageHeader title="Mail Templates" breadcrumb={["Home", "Bulk Mailing", "Templates"]} subtitle="Reusable email templates for campaigns and transactional messages." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {templates.length === 0 ? (
            <Card><EmptyState title="No templates" hint="Create your first template." /></Card>
          ) : (
            templates.map((t) => (
              <Card key={t.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display font-semibold text-ink"><Mail size={15} className="text-brand-500" /> {t.name}</p>
                    <p className="mt-0.5 text-sm font-medium text-ink-soft">{t.subject}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{t.body}</p>
                  </div>
                  <ConfirmButton action={deleteMailTemplate.bind(null, t.id)} confirmText={`Delete "${t.name}"?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
                </div>
              </Card>
            ))
          )}
        </div>
        <Card className="self-start">
          <CardHeader title="New template" />
          <form action={createMailTemplate} className="flex flex-col gap-3 p-5">
            <Field label="Name"><Input name="name" required placeholder="Welcome" /></Field>
            <Field label="Subject"><Input name="subject" required placeholder="Welcome to Emerald H2" /></Field>
            <Field label="Body"><Textarea name="body" rows={5} placeholder="Email body…" /></Field>
            <Button type="submit"><Plus size={16} /> Create Template</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
