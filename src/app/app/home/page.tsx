import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { logoutMember } from "@/app/actions/member-auth";
import { PushToggle } from "@/components/PushToggle";
import { MemberTabBar } from "@/components/MemberTabBar";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Wallet, Users, Gift, CalendarDays, LogOut, ArrowRight, ShieldCheck, ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");

  const member = await prisma.member.findUnique({
    where: { id: Number(session.sub) },
    include: { _count: { select: { referrals: true, bookings: true } } },
  });
  if (!member) redirect("/app/signin");
  if (!member.trainingCompleted) redirect("/app/training");

  const activeStations = await prisma.station.count({ where: { status: "active" } });
  const firstName = member.name.split(" ")[0];

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      {/* header */}
      <header className="flex items-center justify-between px-6 pb-3 pt-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 font-display text-base font-extrabold text-white">H₂</span>
          <span className="font-display text-base font-extrabold tracking-tight text-ink">EMERALD <span className="text-brand-500">H2</span></span>
        </div>
        <form action={logoutMember}>
          <button className="rounded-lg p-2 text-ink-muted hover:bg-[--surface-2]" aria-label="Log out"><LogOut size={18} /></button>
        </form>
      </header>

      <div className="flex-1 px-6 pb-6">
        {/* greeting */}
        <p className="mt-2 text-sm text-ink-muted">Welcome back,</p>
        <h1 className="font-display text-2xl font-bold text-ink">{firstName} 👋</h1>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700"><ShieldCheck size={12} /> Cleared to fuel</span>
          <span className="font-mono text-ink-muted">#{member.membershipCode}</span>
        </div>

        {/* wallet */}
        <div className="mt-5 overflow-hidden rounded-2xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0b3f26,#0b8a4b)" }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm text-white/80"><Wallet size={15} /> Fuel balance</span>
            <Link href="/app/wallet" className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-white/25">Top up</Link>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">{formatCurrency(member.walletBalance)}</p>
          <p className="mt-1 text-xs text-white/70">Add balance to reserve fuel. (Payments are mocked for the demo.)</p>
        </div>

        {/* primary CTA */}
        <Link href="/app/find" className="mt-4 flex items-center justify-between rounded-2xl bg-white p-5 shadow-card ring-1 ring-brand-100 transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><MapPin size={20} /></span>
            <div>
              <p className="font-display font-semibold text-ink">Find a station</p>
              <p className="text-sm text-ink-muted">{activeStations} active near the network</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-ink-muted" />
        </Link>

        {/* quick tiles */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Community", href: "/app/community" },
            { icon: CalendarDays, label: "Events", href: "/app/events" },
            { icon: Gift, label: "Refer & Earn", href: "/app/refer" },
          ].map((t) => (
            <Link key={t.label} href={t.href} className="flex flex-col items-center gap-2 rounded-xl border border-[--border] bg-white px-2 py-4 text-center shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><t.icon size={17} /></span>
              <span className="text-xs font-medium text-ink-soft">{t.label}</span>
            </Link>
          ))}
        </div>

        {/* stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link href="/app/bookings" className="rounded-xl border border-[--border] bg-white p-4 shadow-card transition hover:shadow-md">
            <p className="flex items-center gap-1 font-mono text-[11px] uppercase text-ink-muted"><ListChecks size={12} /> Your bookings</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{member._count.bookings}</p>
          </Link>
          <div className="rounded-xl border border-[--border] bg-white p-4 shadow-card">
            <p className="font-mono text-[11px] uppercase text-ink-muted">Referrals</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{member._count.referrals}</p>
          </div>
        </div>

        {/* notifications */}
        <div className="mt-4"><PushToggle /></div>

        <p className="mt-6 text-center text-xs text-ink-muted">Events &amp; direct messages arrive in M4.</p>
      </div>
      <MemberTabBar />
    </div>
  );
}
