import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { MemberTabBar } from "@/components/MemberTabBar";
import { Avatar } from "@/components/ui";
import { Search, MapPin, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, string> = {
    VIP: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Supporter: "bg-sky-50 text-sky-700 ring-sky-600/20",
    Member: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${map[tier] ?? map.Member}`}>{tier}</span>;
}

export default async function MembersPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");

  const q = (searchParams.q || "").trim();
  const where = q
    ? {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { company: { contains: q, mode: "insensitive" as const } },
          { headline: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : { isActive: true };

  const [members, total] = await Promise.all([
    prisma.member.findMany({ where, orderBy: { createdAt: "desc" }, take: 60 }),
    prisma.member.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      <div className="flex-1 px-5 pb-6 pt-6">
        <h1 className="font-display text-2xl font-bold text-ink">Member Directory</h1>
        <p className="mb-4 text-sm text-ink-muted">Connect with the Emerald H2 community · {total} members</p>

        <form className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name or company…"
            className="w-full rounded-xl border border-[--border] bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-400"
          />
        </form>

        <div className="mt-4 flex flex-col gap-2.5">
          {members.map((m) => (
            <Link key={m.id} href={`/app/members/${m.id}`} className="flex items-center gap-3 rounded-xl border border-[--border] bg-surface p-3.5 shadow-card transition hover:shadow-md">
              <Avatar name={m.name} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-sm font-semibold text-ink">{m.name}</p>
                  <TierBadge tier={m.tier} />
                </div>
                {m.headline && <p className="truncate text-xs text-ink-muted">{m.headline}</p>}
                <p className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-muted">
                  {m.company && <span className="flex items-center gap-1"><Building2 size={11} /> {m.company}</span>}
                  {(m.city || m.state) && <span className="flex items-center gap-1"><MapPin size={11} /> {[m.city, m.state].filter(Boolean).join(", ")}</span>}
                </p>
              </div>
            </Link>
          ))}
          {members.length === 0 && (
            <p className="rounded-xl border border-dashed border-[--border] bg-surface px-4 py-8 text-center text-sm text-ink-muted">No members match &ldquo;{q}&rdquo;.</p>
          )}
        </div>
      </div>
      <MemberTabBar />
    </div>
  );
}
