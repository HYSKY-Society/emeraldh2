import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { ChevronLeft, Building2, MapPin, Briefcase, CalendarDays, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MemberProfileView({ params }: { params: { id: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const meId = Number(session.sub);

  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { posts: true, referrals: true } },
    },
  });
  if (!member) notFound();
  const isMe = member.id === meId;

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/members" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Directory
      </Link>

      <div className="mt-5 flex flex-col items-center rounded-2xl border border-[--border] bg-white p-6 text-center shadow-card">
        <Avatar name={member.name} size={80} />
        <h1 className="mt-3 font-display text-xl font-bold text-ink">{member.name}</h1>
        <span className="mt-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">{member.tier}</span>
        {member.headline && <p className="mt-2 text-sm text-ink-soft">{member.headline}</p>}
        {member.bio && <p className="mt-2 max-w-sm text-sm text-ink-muted">{member.bio}</p>}
        {isMe && (
          <Link href="/app/profile" className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[--border] px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-[--surface-2]">
            <Pencil size={14} /> Edit profile
          </Link>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2.5 rounded-2xl border border-[--border] bg-white p-5 text-sm shadow-card">
        {member.jobTitle && <p className="flex items-center gap-2.5 text-ink-soft"><Briefcase size={15} className="text-ink-muted" /> {member.jobTitle}</p>}
        {member.company && <p className="flex items-center gap-2.5 text-ink-soft"><Building2 size={15} className="text-ink-muted" /> {member.company}</p>}
        {(member.city || member.state) && <p className="flex items-center gap-2.5 text-ink-soft"><MapPin size={15} className="text-ink-muted" /> {[member.city, member.state].filter(Boolean).join(", ")}</p>}
        <p className="flex items-center gap-2.5 text-ink-soft"><CalendarDays size={15} className="text-ink-muted" /> Member since {member.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      </div>

      {member.posts.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-muted">Recent posts</p>
          <div className="flex flex-col gap-2.5">
            {member.posts.map((p) => (
              <div key={p.id} className="rounded-xl border border-[--border] bg-white p-4 shadow-card">
                <p className="text-sm text-ink-soft">{p.body}</p>
                <p className="mt-2 text-xs text-ink-muted">{timeAgo(p.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
