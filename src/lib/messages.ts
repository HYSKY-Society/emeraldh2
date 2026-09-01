import "server-only";
import { prisma } from "@/lib/db";

export type Thread = {
  otherId: number;
  otherName: string;
  last: string;
  at: Date;
  unread: number;
};

// Build the conversation thread list for a member (most-recent first).
export async function getThreads(me: number): Promise<Thread[]> {
  const msgs = await prisma.message.findMany({
    where: { OR: [{ senderId: me }, { recipientId: me }] },
    orderBy: { createdAt: "desc" },
    include: { sender: true, recipient: true },
  });

  const threads = new Map<number, Thread>();
  for (const m of msgs) {
    const other = m.senderId === me ? m.recipient : m.sender;
    if (!threads.has(other.id)) {
      threads.set(other.id, { otherId: other.id, otherName: other.name, last: m.body, at: m.createdAt, unread: 0 });
    }
    if (m.recipientId === me && !m.readAt) threads.get(other.id)!.unread++;
  }
  return [...threads.values()];
}
