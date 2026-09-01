import Link from "next/link";
import { redirect } from "next/navigation";
import { getMemberSession } from "@/lib/member-auth";
import { ChevronLeft, Hammer } from "lucide-react";

export const dynamic = "force-dynamic";

const LABELS: Record<string, { title: string; when: string }> = {
  find: { title: "Station Finder", when: "M2" },
  book: { title: "Booking", when: "M2" },
  events: { title: "Events", when: "M4" },
  messages: { title: "Messages", when: "M4" },
};

export default async function ComingSoon({ params }: { params: { slug: string[] } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");

  const key = params.slug?.[0] ?? "";
  const meta = LABELS[key] ?? { title: "This screen", when: "soon" };

  return (
    <main className="flex min-h-[100dvh] flex-col px-7 pb-10 pt-8" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Hammer size={24} /></span>
        <h1 className="font-display text-xl font-bold text-ink">{meta.title}</h1>
        <p className="max-w-xs text-sm text-ink-muted">
          Arriving in milestone <b className="text-brand-600">{meta.when}</b>. The foundation, auth, and safety-test gate are live now.
        </p>
        <Link href="/app/home" className="mt-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
