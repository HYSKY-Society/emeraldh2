import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Field, Input, Textarea, Select, Button, EmptyState } from "@/components/ui";
import { sendBulkMail } from "@/app/actions/crud";
import { formatDateTime } from "@/lib/utils";
import { Send, ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MailPage() {
  const [sent, all, approved, pending] = await Promise.all([
    prisma.sentMail.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.member.count(),
    prisma.member.count({ where: { isApproved: true } }),
    prisma.member.count({ where: { isApproved: false } }),
  ]);

  return (
    <>
      <PageHeader
        title="Bulk Mailing"
        breadcrumb={["Home", "Bulk Mailing"]}
        subtitle="Send an email campaign to a segment of members."
        action={<Link href="/admin/mail/templates" className="inline-flex items-center gap-1.5 rounded-lg border border-[--border] bg-surface px-3.5 py-2 text-sm font-semibold text-ink-soft hover:bg-[--surface-2]"><ListChecks size={16} /> Templates</Link>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Compose campaign" />
          <form action={sendBulkMail} className="flex flex-col gap-4 p-5">
            <Field label="Send to" hint={`All: ${all} · Approved: ${approved} · Pending: ${pending}`}>
              <Select name="segment" defaultValue="all">
                <option value="all">All members ({all})</option>
                <option value="approved">Approved only ({approved})</option>
                <option value="pending">Pending approval ({pending})</option>
              </Select>
            </Field>
            <Field label="Subject"><Input name="subject" required placeholder="An update from Emerald H2" /></Field>
            <Field label="Message"><Textarea name="body" rows={8} placeholder="Write your email…" /></Field>
            <div>
              <Button type="submit"><Send size={16} /> Send Campaign</Button>
              <p className="mt-2 text-xs text-ink-muted">Delivery is logged here. Wire an SMTP provider in Settings → Mail Setup to actually send.</p>
            </div>
          </form>
        </Card>

        <Card className="self-start">
          <CardHeader title="Recent sends" />
          {sent.length === 0 ? (
            <EmptyState title="Nothing sent yet" />
          ) : (
            <ul className="divide-y divide-[--border]">
              {sent.map((s) => (
                <li key={s.id} className="px-5 py-3">
                  <p className="truncate text-sm font-semibold text-ink">{s.subject}</p>
                  <p className="text-xs text-ink-muted">{s.recipients} recipients · {s.segment} · {formatDateTime(s.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
