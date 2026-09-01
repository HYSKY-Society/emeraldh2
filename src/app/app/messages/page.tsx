import Link from "next/link";
import { redirect } from "next/navigation";
import { getMemberSession } from "@/lib/member-auth";
import { getThreads } from "@/lib/messages";
import { ThreadList } from "@/components/ThreadList";
import { MemberTabBar } from "@/components/MemberTabBar";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const threads = await getThreads(Number(session.sub));

  return (
    <>
      {/* mobile: the conversation list (desktop shows it in the layout rail) */}
      <div className="flex min-h-[100dvh] flex-col lg:hidden" style={{ background: "var(--ground)" }}>
        <div className="flex-1 px-5 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-ink">Messages</h1>
            <Link href="/app/members" className="inline-flex items-center gap-1.5 rounded-lg border border-[--border] bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-[--surface-2]">
              <MessageSquarePlus size={14} /> New
            </Link>
          </div>
          <div className="mt-4">
            <ThreadList threads={threads} />
          </div>
        </div>
        <MemberTabBar />
      </div>

      {/* desktop: empty state beside the rail */}
      <div className="hidden min-h-[100dvh] flex-col items-center justify-center px-6 text-center lg:flex" style={{ background: "var(--ground)" }}>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500"><MessagesSquare size={26} /></span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">Your messages</p>
        <p className="mt-1 max-w-xs text-sm text-ink-muted">Pick a conversation from the list, or start a new one from the member directory.</p>
        <Link href="/app/members" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          <MessageSquarePlus size={15} /> New message
        </Link>
      </div>
    </>
  );
}
