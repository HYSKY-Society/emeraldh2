import { PageHeader, Card, Field, Input, Textarea, Select, Button, LinkButton } from "@/components/ui";
import { createNews } from "@/app/actions/crud";
import { Plus } from "lucide-react";

export default function NewNewsPage() {
  return (
    <>
      <PageHeader title="Add a News/Media" breadcrumb={["Home", "News", "Add"]} />
      <Card className="max-w-2xl">
        <form action={createNews} className="flex flex-col gap-4 p-5">
          <Field label="Title"><Input name="title" required placeholder="MRE fuels the future with hydrogen power" /></Field>
          <Field label="Excerpt"><Input name="excerpt" placeholder="Short summary shown in listings" /></Field>
          <Field label="Body"><Textarea name="body" rows={7} placeholder="Full article…" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <Select name="type" defaultValue="news">
                <option value="news">News</option>
                <option value="media">Media</option>
                <option value="press">Press</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue="published">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </Field>
          </div>
          <div className="flex gap-2">
            <Button type="submit"><Plus size={16} /> Publish</Button>
            <LinkButton href="/admin/news" variant="outline">Cancel</LinkButton>
          </div>
        </form>
      </Card>
    </>
  );
}
