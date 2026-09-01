import { PageHeader, Card, Field, Input, Textarea, Select, Button, LinkButton } from "@/components/ui";
import { createContent } from "@/app/actions/crud";
import { Plus } from "lucide-react";

export default function NewContentPage() {
  return (
    <>
      <PageHeader title="Add a New Content" breadcrumb={["Home", "Content", "Add"]} />
      <Card className="max-w-2xl">
        <form action={createContent} className="flex flex-col gap-4 p-5">
          <Field label="Title"><Input name="title" required placeholder="About Emerald H2" /></Field>
          <Field label="Body"><Textarea name="body" rows={8} placeholder="Write the page content…" /></Field>
          <Field label="Status">
            <Select name="status" defaultValue="published">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit"><Plus size={16} /> Create Content</Button>
            <LinkButton href="/admin/content" variant="outline">Cancel</LinkButton>
          </div>
        </form>
      </Card>
    </>
  );
}
