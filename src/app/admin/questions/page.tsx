import { prisma } from "@/lib/db";
import { PageHeader, Card, Table, Th, Td, StatusBadge, LinkButton, EmptyState } from "@/components/ui";
import { ActionButton, ConfirmButton } from "@/components/ConfirmButton";
import { toggleQuestion, deleteQuestion } from "@/app/actions/crud";
import { formatDate } from "@/lib/utils";
import { Plus, Power, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const questions = await prisma.question.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHeader
        title="Safety Questions"
        breadcrumb={["Home", "App & Booking", "Questions"]}
        subtitle="The Level-1 membership agreement and safety quiz a driver must pass before fueling."
        action={<LinkButton href="/admin/questions/new"><Plus size={16} /> Add Question</LinkButton>}
      />

      <Card>
        {questions.length === 0 ? (
          <EmptyState title="No questions" hint="Add safety questions drivers must acknowledge." />
        ) : (
          <Table>
            <thead>
              <tr><Th className="w-10">#</Th><Th>Question</Th><Th>Status</Th><Th>Created</Th><Th className="text-right">Actions</Th></tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id} className="align-top">
                  <Td className="font-mono text-xs text-ink-muted">{i + 1}</Td>
                  <Td className="max-w-xl text-sm text-ink-soft">{q.text}</Td>
                  <Td><StatusBadge status={q.status} /></Td>
                  <Td className="whitespace-nowrap text-sm">{formatDate(q.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <ActionButton
                        action={toggleQuestion.bind(null, q.id, q.status === "active" ? "inactive" : "active")}
                        className="rounded-md p-1.5 text-ink-muted hover:bg-[--surface-2] hover:text-amber-600"
                      >
                        <Power size={15} />
                      </ActionButton>
                      <ConfirmButton action={deleteQuestion.bind(null, q.id)} confirmText="Delete this question?" className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={15} />
                      </ConfirmButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
