import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { RsvpButton } from "@/components/RsvpButton";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, Calendar, Clock, MapPin, Video, Users, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

function timeStr(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default async function EventsPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const [events, myRsvps, news] = await Promise.all([
    prisma.event.findMany({ orderBy: { startsAt: "asc" }, include: { _count: { select: { rsvps: true } } } }),
    prisma.eventRSVP.findMany({ where: { memberId }, select: { eventId: true } }),
    prisma.newsMedia.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 5 }),
  ]);
  const going = new Set(myRsvps.map((r) => r.eventId));
  const featured = events.find((e) => e.isFeatured);
  const rest = events.filter((e) => e.id !== featured?.id);

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <h1 className="mb-4 mt-3 font-display text-2xl font-bold text-ink">Events</h1>

      {featured && (
        <div className="overflow-hidden rounded-2xl border border-brand-200 bg-surface shadow-card">
          <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white" style={{ background: "linear-gradient(135deg,#0b3f26,#0b8a4b)" }}>
            ★ Featured Event
          </div>
          <div className="p-5">
            <h2 className="font-display text-lg font-bold text-ink">{featured.title}</h2>
            <div className="mt-2 flex flex-col gap-1.5 text-sm text-ink-soft">
              <p className="flex items-center gap-2"><Calendar size={15} className="text-brand-500" /> {formatDate(featured.startsAt)}</p>
              <p className="flex items-center gap-2"><Clock size={15} className="text-brand-500" /> {timeStr(featured.startsAt)}</p>
              <p className="flex items-center gap-2">{featured.isVirtual ? <Video size={15} className="text-brand-500" /> : <MapPin size={15} className="text-brand-500" />} {featured.location}</p>
            </div>
            <p className="mt-3 text-sm text-ink-muted">{featured.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-ink-muted"><Users size={13} /> {featured._count.rsvps} going</span>
              <RsvpButton eventId={featured.id} going={going.has(featured.id)} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
        {rest.map((e) => (
          <div key={e.id} className="rounded-2xl border border-[--border] bg-surface p-5 shadow-card">
            <h3 className="font-display font-semibold text-ink">{e.title}</h3>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(e.startsAt)} · {timeStr(e.startsAt)}</span>
              <span className="flex items-center gap-1">{e.isVirtual ? <Video size={12} /> : <MapPin size={12} />} {e.location}</span>
            </div>
            <p className="mt-2 text-sm text-ink-muted">{e.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-ink-muted"><Users size={12} /> {e._count.rsvps} going</span>
              <RsvpButton eventId={e.id} going={going.has(e.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* News */}
      {news.length > 0 && (
        <div className="mt-8">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted"><Newspaper size={13} /> Latest news</p>
          <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-2 lg:gap-3">
            {news.map((n) => (
              <div key={n.id} className="rounded-xl border border-[--border] bg-surface p-4 shadow-card">
                <p className="font-display text-sm font-semibold text-ink">{n.title}</p>
                {n.excerpt && <p className="mt-1 text-sm text-ink-muted">{n.excerpt}</p>}
                <p className="mt-1.5 text-[11px] uppercase tracking-wide text-ink-muted">{n.type} · {formatDate(n.publishedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
