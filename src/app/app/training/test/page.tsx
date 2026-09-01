import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { completeSafetyTest } from "@/app/actions/member-auth";
import { ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SafetyTestPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");

  const questions = await prisma.question.findMany({ where: { status: "active" }, orderBy: { createdAt: "asc" } });

  return (
    <main className="flex min-h-[100dvh] flex-col px-6 pb-10 pt-8" style={{ background: "var(--ground)" }}>
      <div className="mb-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600">Safety Test</p>
        <h1 className="mt-1 font-display text-xl font-bold text-ink">Answer all {questions.length} to continue</h1>
        <p className="mt-1 text-sm text-ink-muted">Read each statement and confirm your understanding.</p>
      </div>

      <form action={completeSafetyTest} className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <fieldset key={q.id} className="rounded-xl border border-[--border] bg-white p-4 shadow-card">
            <legend className="sr-only">Question {i + 1}</legend>
            <p className="text-sm text-ink-soft">
              <span className="mr-1 font-mono text-xs font-semibold text-brand-600">{i + 1}.</span>
              {q.text}
            </p>
            <div className="mt-3 flex gap-2">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[--border] px-3 py-2 text-sm font-medium text-ink-soft has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700">
                <input type="radio" name={`q${q.id}`} value="yes" required className="accent-brand-500" /> Yes
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[--border] px-3 py-2 text-sm font-medium text-ink-soft has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700">
                <input type="radio" name={`q${q.id}`} value="no" className="accent-brand-500" /> No
              </label>
            </div>
          </fieldset>
        ))}

        <button
          type="submit"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-lg transition hover:bg-brand-600"
        >
          <ClipboardCheck size={18} /> Submit &amp; Unlock App
        </button>
      </form>
    </main>
  );
}
