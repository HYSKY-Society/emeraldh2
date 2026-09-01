import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, EmptyState, Field, Input, Textarea, Button } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { createTrainingScreen, deleteTrainingScreen } from "@/app/actions/crud";
import { Trash2, Plus, Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppTrainingPage() {
  const screens = await prisma.trainingScreen.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader
        title="App Training Screens"
        breadcrumb={["Home", "App & Booking", "App Training"]}
        subtitle="Onboarding & instruction screens shown to drivers in the mobile app before they operate a station."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {screens.length === 0 ? (
            <Card><EmptyState title="No screens" hint="Add an app training screen." /></Card>
          ) : (
            screens.map((s, i) => (
              <Card key={s.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 font-mono text-sm font-semibold text-brand-600">{i + 1}</span>
                    <div>
                      <p className="flex items-center gap-2 font-display font-semibold text-ink"><Smartphone size={15} className="text-brand-500" /> {s.title}</p>
                      <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
                    </div>
                  </div>
                  <ConfirmButton action={deleteTrainingScreen.bind(null, s.id)} confirmText={`Delete "${s.title}"?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
                </div>
              </Card>
            ))
          )}
        </div>
        <Card className="self-start">
          <CardHeader title="Add a screen" />
          <form action={createTrainingScreen} className="flex flex-col gap-3 p-5">
            <Field label="Title"><Input name="title" required placeholder="First-time instructions" /></Field>
            <Field label="Body"><Textarea name="body" placeholder="Screen content" /></Field>
            <Field label="Sort order"><Input name="sortOrder" type="number" defaultValue="0" /></Field>
            <Button type="submit"><Plus size={16} /> Add Screen</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
