import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { ShieldCheck, FileText, ArrowRight, ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");

  const member = await prisma.member.findUnique({ where: { id: Number(session.sub) } });
  if (member?.trainingCompleted) redirect("/app/home");

  const [screens, questionCount] = await Promise.all([
    prisma.trainingScreen.findMany({ where: { status: "active" }, orderBy: { sortOrder: "asc" } }),
    prisma.question.count({ where: { status: "active" } }),
  ]);

  return (
    <main className="flex min-h-[100dvh] flex-col px-7 pb-10 pt-9" style={{ background: "var(--ground)" }}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <ShieldCheck size={24} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Safety first</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Before you can fuel, learn how to operate an Emerald H2 station safely and pass a short {questionCount}-question test.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {screens.map((s, i) => (
          <div key={s.id} className="flex gap-3 rounded-xl border border-[--border] bg-surface p-4 shadow-card">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 font-mono text-xs font-semibold text-brand-600">{i + 1}</span>
            <div>
              <p className="font-display text-sm font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[--border] bg-surface px-4 py-3 text-sm text-ink-soft shadow-card">
        <FileText size={16} className="text-brand-500" />
        Full fueling instructions are available in-app as a PDF.
      </div>

      <Link
        href="/app/training/test"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-lg transition hover:bg-brand-600"
      >
        <ClipboardCheck size={18} /> Start the Safety Test <ArrowRight size={16} />
      </Link>
    </main>
  );
}
