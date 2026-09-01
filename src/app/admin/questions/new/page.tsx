import { PageHeader, Card, Field, Textarea, Select, Button, LinkButton } from "@/components/ui";
import { createQuestion } from "@/app/actions/crud";
import { Plus } from "lucide-react";

export default function NewQuestionPage() {
  return (
    <>
      <PageHeader title="Add Question" breadcrumb={["Home", "Questions", "Add"]} />
      <Card className="max-w-2xl">
        <form action={createQuestion} className="flex flex-col gap-4 p-5">
          <Field label="Question / statement" hint="Shown in the app safety quiz before a driver can operate a station.">
            <Textarea name="text" required rows={4} placeholder="As a member of Emerald H2, is it your responsibility to…" />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue="active">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit"><Plus size={16} /> Add Question</Button>
            <LinkButton href="/admin/questions" variant="outline">Cancel</LinkButton>
          </div>
        </form>
      </Card>
    </>
  );
}
