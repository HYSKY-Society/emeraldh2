import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { MessageComposer } from "@/components/MessageComposer";
import { Avatar } from "@/components/ui";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: { memberId: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const me = Number(session.sub);

  const otherId = Number(params.memberId);
  if (Number.isNaN(otherId) || otherId === me) notFound();

  const other = await prisma.member.findUnique({ where: { id: otherId } });
  if (!other) notFound();

  // Mark their messages to me as read.
  await prisma.message.updateMany({
    where: { senderId: otherId, recipientId: me, readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me, recipientId: otherId },
        { senderId: otherId, recipientId: me },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      {/* header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[--border] bg-surface px-4 py-3 backdrop-blur">
        <Link href="/app/messages" className="text-ink-muted"><ChevronLeft size={20} /></Link>
        <Avatar name={other.name} size={36} />
        <Link href={`/app/members/${other.id}`} className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-ink">{other.name}</p>
          {other.headline && <p className="truncate text-xs text-ink-muted">{other.headline}</p>}
        </Link>
      </header>

      {/* messages */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-muted">Say hello to {other.name.split(" ")[0]} 👋</p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === me;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                  mine ? "rounded-br-sm bg-brand-500 text-white" : "rounded-bl-sm border border-[--border] bg-surface text-ink-soft"
                }`}
              >
                {m.body}
              </div>
            </div>
          );
        })}
      </div>

      <MessageComposer recipientId={otherId} />
    </div>
  );
}
