import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Field, Input, Button } from "@/components/ui";
import { saveMailSettings } from "@/app/actions/crud";
import { Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MailSetupPage() {
  const s = await prisma.setting.findUnique({ where: { id: 1 } });
  return (
    <>
      <PageHeader title="Mail Setup" breadcrumb={["Home", "Settings", "Mail Setup"]} subtitle="SMTP configuration used for transactional and bulk email." />
      <Card className="max-w-2xl">
        <form action={saveMailSettings} className="flex flex-col">
          <CardHeader title="SMTP server" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="SMTP host"><Input name="smtpHost" defaultValue={s?.smtpHost || ""} placeholder="smtp.mailprovider.com" /></Field>
            <Field label="SMTP port"><Input name="smtpPort" type="number" defaultValue={s?.smtpPort ?? ""} placeholder="587" /></Field>
            <Field label="SMTP username"><Input name="smtpUser" defaultValue={s?.smtpUser || ""} /></Field>
            <Field label="SMTP password"><Input name="smtpPassword" type="password" defaultValue={s?.smtpPassword || ""} /></Field>
          </div>
          <CardHeader title="From" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="From email"><Input name="fromEmail" type="email" defaultValue={s?.fromEmail || ""} /></Field>
            <Field label="From name"><Input name="fromName" defaultValue={s?.fromName || ""} /></Field>
          </div>
          <div className="border-t border-[--border] p-5"><Button type="submit"><Save size={16} /> Save Mail Setup</Button></div>
        </form>
      </Card>
    </>
  );
}
