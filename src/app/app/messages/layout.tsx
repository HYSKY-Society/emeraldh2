import Link from "next/link";
import { redirect } from "next/navigation";
import { getMemberSession } from "@/lib/member-auth";
import { getThreads } from "@/lib/messages";
import { ThreadList } from "@/components/ThreadList";
import { MessageSquarePlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const threads = await getThreads(Number(session.sub));

  return (
    <div className="flex min-h-[100dvh]">
      {/* desktop conversation rail */}
      <aside className="sticky top-0 hidden h-[100dvh] w-[340px] shrink-0 flex-col border-r border-[--border] bg-surface lg:flex">
        <div className="flex items-center justify-between border-b border-[--border] px-5 py-4">
          <h1 className="font-display text-lg font-bold text-ink">Messages</h1>
          <Link href="/app/members" className="inline-flex items-center gap-1.5 rounded-lg border border-[--border] bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-[--surface-2]">
            <MessageSquarePlus size={14} /> New
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <ThreadList threads={threads} />
        </div>
      </aside>

      {/* active conversation (or the mobile list / empty state) */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
