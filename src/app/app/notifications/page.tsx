import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { timeAgo } from "@/lib/utils";
import { ChevronLeft, MessageSquare, Fuel, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

const ICON: Record<string, typeof Bell> = { message: MessageSquare, booking: Fuel, system: Bell };

export default async function NotificationsPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const notes = await prisma.notification.findMany({ where: { memberId }, orderBy: { createdAt: "desc" }, take: 50 });
  // Mark everything read now that they're viewing (kept out of the fetched copy above).
  await prisma.notification.updateMany({ where: { memberId, read: false }, data: { read: true } });

  return (
    <main className="min-h-[100dvh] px-5 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <h1 className="mb-4 mt-3 font-display text-2xl font-bold text-ink">Notifications</h1>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[--border] bg-surface px-4 py-10 text-center text-sm text-ink-muted">
          You&rsquo;re all caught up.
        </div>
      ) : (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
          {notes.map((n) => {
            const Icon = ICON[n.type] ?? Bell;
            const inner = (
              <div className={`flex items-start gap-3 rounded-xl border p-4 shadow-card ${n.read ? "border-[--border] bg-surface" : "border-brand-200 bg-brand-50"}`}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-brand-600 ring-1 ring-inset ring-[--border]"><Icon size={17} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-sm font-semibold text-ink">{n.title}</p>
                    <span className="shrink-0 text-[11px] text-ink-muted">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-muted">{n.body}</p>
                </div>
              </div>
            );
            return n.url ? (
              <Link key={n.id} href={n.url}>{inner}</Link>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </main>
  );
}
