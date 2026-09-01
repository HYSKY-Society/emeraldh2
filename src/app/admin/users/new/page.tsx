import { PageHeader, Card, Field, Input, Button, LinkButton } from "@/components/ui";
import { createMember } from "@/app/actions/members";
import { UserPlus } from "lucide-react";

export default function NewMemberPage() {
  return (
    <>
      <PageHeader title="Add a New Member" breadcrumb={["Home", "Members", "Add"]} />
      <Card className="max-w-2xl">
        <form action={createMember} className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name"><Input name="name" required placeholder="Jane Driver" /></Field>
            <Field label="Email"><Input name="email" type="email" required placeholder="jane@example.com" /></Field>
            <Field label="Phone"><Input name="phone" placeholder="(937) 555-0100" /></Field>
            <Field label="Address"><Input name="addressLine" placeholder="123 Main St" /></Field>
            <Field label="City"><Input name="city" placeholder="Dayton" /></Field>
            <Field label="State"><Input name="state" placeholder="OH" /></Field>
            <Field label="ZIP"><Input name="zip" placeholder="45405" /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="isApproved" className="h-4 w-4 rounded border-[--border] text-brand-500" />
            Approve immediately (skip the approval queue)
          </label>
          <div className="flex gap-2">
            <Button type="submit"><UserPlus size={16} /> Create Member</Button>
            <LinkButton href="/admin/users" variant="outline">Cancel</LinkButton>
          </div>
        </form>
      </Card>
    </>
  );
}
