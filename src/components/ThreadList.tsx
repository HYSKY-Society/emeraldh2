"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export type ThreadListItem = {
  otherId: number;
  otherName: string;
  last: string;
  at: Date | string;
  unread: number;
};

export function ThreadList({ threads, className = "" }: { threads: ThreadListItem[]; className?: string }) {
  const pathname = usePathname();

  if (threads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[--border] bg-surface px-4 py-10 text-center text-sm text-ink-muted">
        No messages yet. Open a member from the{" "}
        <Link href="/app/members" className="font-semibold text-brand-600">directory</Link> to start a conversation.
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {threads.map((t) => {
        const active = pathname === `/app/messages/${t.otherId}`;
        return (
          <Link
            key={t.otherId}
            href={`/app/messages/${t.otherId}`}
            className={`flex items-center gap-3 rounded-xl border p-3.5 shadow-card transition ${
              active ? "border-brand-300 bg-brand-50/60 ring-1 ring-brand-200" : "border-[--border] bg-surface hover:shadow-md"
            }`}
          >
            <Avatar name={t.otherName} size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-display text-sm font-semibold text-ink">{t.otherName}</p>
                <span className="shrink-0 text-[11px] text-ink-muted">{timeAgo(t.at)}</span>
              </div>
              <p className={`truncate text-sm ${t.unread ? "font-medium text-ink" : "text-ink-muted"}`}>{t.last}</p>
            </div>
            {t.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">{t.unread}</span>}
          </Link>
        );
      })}
    </div>
  );
}
