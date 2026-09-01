import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { ReferShare } from "@/components/ReferShare";
import { Avatar } from "@/components/ui";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { ChevronLeft, Gift, Users, Gem } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReferPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");

  const member = await prisma.member.findUnique({
    where: { id: Number(session.sub) },
    include: { referrals: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!member) redirect("/app/signin");

  const code = member.membershipCode || "—";

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <h1 className="mb-1 mt-3 font-display text-2xl font-bold text-ink">Refer &amp; Earn</h1>
      <p className="text-sm text-ink-muted">Invite others and earn emeralds toward fuel, merch, and more.</p>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        {/* left: code + share */}
        <div>
          {/* code card */}
          <div className="mt-5 overflow-hidden rounded-2xl p-6 text-center text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0b3f26,#0b8a4b)" }}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">Your referral code</p>
            <p className="mt-2 font-display text-4xl font-extrabold tracking-[0.15em] tabular">{code}</p>
          </div>
          <div className="mt-3"><ReferShare code={code} /></div>
        </div>

        {/* right: stats + referrals */}
        <div>
          {/* stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[--border] bg-surface p-4 shadow-card">
              <p className="flex items-center gap-1 font-mono text-[11px] uppercase text-ink-muted"><Users size={12} /> Referrals</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{member.referrals.length}</p>
            </div>
            <div className="rounded-xl border border-[--border] bg-surface p-4 shadow-card">
              <p className="flex items-center gap-1 font-mono text-[11px] uppercase text-ink-muted"><Gem size={12} /> Emeralds</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{formatCurrency(member.referralEarnings)}</p>
            </div>
          </div>

          {/* referrals */}
          <p className="mb-2 mt-6 font-mono text-[11px] uppercase tracking-wider text-ink-muted">People you referred</p>
          {member.referrals.length === 0 ? (
            <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-[--border] bg-surface px-4 py-8 text-center">
              <Gift size={22} className="text-brand-500" />
              <p className="text-sm text-ink-muted">No referrals yet. Share your code to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {member.referrals.map((r) => (
                <Link key={r.id} href={`/app/members/${r.id}`} className="flex items-center gap-3 rounded-xl border border-[--border] bg-surface p-3 shadow-card">
                  <Avatar name={r.name} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-xs text-ink-muted">Joined {timeAgo(r.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
