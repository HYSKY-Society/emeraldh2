import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Field, Input, Textarea, Button } from "@/components/ui";
import { saveSettings } from "@/app/actions/crud";
import { Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await prisma.setting.findUnique({ where: { id: 1 } });
  return (
    <>
      <PageHeader title="General Settings" breadcrumb={["Home", "Settings", "General"]} subtitle="Company identity, contact details and app links." />
      <Card className="max-w-2xl">
        <form action={saveSettings} className="flex flex-col">
          <CardHeader title="Company" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Company name"><Input name="companyName" defaultValue={s?.companyName || ""} /></Field>
            <Field label="Copyright"><Input name="copyright" defaultValue={s?.copyright || ""} /></Field>
          </div>
          <CardHeader title="Contact" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Contact email"><Input name="contactEmail" type="email" defaultValue={s?.contactEmail || ""} /></Field>
            <Field label="Contact phone"><Input name="contactPhone" defaultValue={s?.contactPhone || ""} /></Field>
            <div className="sm:col-span-2"><Field label="Address"><Textarea name="contactAddress" rows={2} defaultValue={s?.contactAddress || ""} /></Field></div>
          </div>
          <CardHeader title="App links" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Android app URL"><Input name="androidUrl" defaultValue={s?.androidUrl || ""} placeholder="https://play.google.com/…" /></Field>
            <Field label="iOS app URL"><Input name="iosUrl" defaultValue={s?.iosUrl || ""} placeholder="https://apps.apple.com/…" /></Field>
          </div>
          <div className="border-t border-[--border] p-5"><Button type="submit"><Save size={16} /> Save Settings</Button></div>
        </form>
      </Card>
    </>
  );
}
