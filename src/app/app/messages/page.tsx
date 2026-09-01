import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { MemberTabBar } from "@/components/MemberTabBar";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { MessageSquarePlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const me = Number(session.sub);

  const msgs = await prisma.message.findMany({
    where: { OR: [{ senderId: me }, { recipientId: me }] },
    orderBy: { createdAt: "desc" },
    include: { sender: true, recipient: true },
  });

  type Thread = { otherId: number; otherName: string; last: string; at: Date; unread: number };
  const threads = new Map<number, Thread>();
  for (const m of msgs) {
    const other = m.senderId === me ? m.recipient : m.sender;
    if (!threads.has(other.id)) {
      threads.set(other.id, { otherId: other.id, otherName: other.name, last: m.body, at: m.createdAt, unread: 0 });
    }
    if (m.recipientId === me && !m.readAt) threads.get(other.id)!.unread++;
  }
  const list = [...threads.values()];

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      <div className="flex-1 px-5 pb-6 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">Messages</h1>
          <Link href="/app/members" className="inline-flex items-center gap-1.5 rounded-lg border border-[--border] bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-[--surface-2]">
            <MessageSquarePlus size={14} /> New
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[--border] bg-surface px-4 py-10 text-center text-sm text-ink-muted">
            No messages yet. Open a member from the <Link href="/app/members" className="font-semibold text-brand-600">directory</Link> to start a conversation.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {list.map((t) => (
              <Link key={t.otherId} href={`/app/messages/${t.otherId}`} className="flex items-center gap-3 rounded-xl border border-[--border] bg-surface p-3.5 shadow-card transition hover:shadow-md">
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
            ))}
          </div>
        )}
      </div>
      <MemberTabBar />
    </div>
  );
}
