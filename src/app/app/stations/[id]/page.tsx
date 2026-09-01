import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, MapPin, Clock, Phone, Fuel, Navigation, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; dot: string; cls: string }> = {
  active: { label: "Active", dot: "bg-emerald-500", cls: "text-emerald-700" },
  maintenance: { label: "Coming soon", dot: "bg-amber-500", cls: "text-amber-700" },
  offline: { label: "Offline", dot: "bg-red-500", cls: "text-red-700" },
};

export default async function StationDetail({ params }: { params: { id: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const [station, fav] = await Promise.all([
    prisma.station.findUnique({ where: { id } }),
    prisma.favorite.findUnique({ where: { memberId_stationId: { memberId, stationId: id } } }),
  ]);
  if (!station) notFound();

  const st = STATUS[station.status] ?? STATUS.offline;
  const mapsUrl =
    station.latitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.address)}`;

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/find" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${st.cls}`}>
            <span className={`h-2 w-2 rounded-full ${st.dot}`} /> {st.label}
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">{station.title}</h1>
          <p className="font-mono text-[11px] text-ink-muted">{station.code}</p>
        </div>
        <FavoriteButton stationId={station.id} favorite={!!fav} />
      </div>

      <div className="mt-5 flex flex-col gap-2.5 rounded-2xl border border-[--border] bg-white p-5 shadow-card text-sm">
        <p className="flex items-start gap-2.5 text-ink-soft"><MapPin size={16} className="mt-0.5 text-ink-muted" /> {station.address}</p>
        <p className="flex items-center gap-2.5 text-ink-soft"><Clock size={16} className="text-ink-muted" /> {station.timings || "24/7"}</p>
        <p className="flex items-center gap-2.5 text-ink-soft"><Phone size={16} className="text-ink-muted" /> {station.phone || "—"}</p>
        <p className="flex items-center gap-2.5 text-ink-soft"><Fuel size={16} className="text-ink-muted" /> {formatCurrency(station.pricePerKg)} / kg</p>
      </div>

      <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[--border] bg-white py-3 text-sm font-semibold text-ink-soft hover:bg-[--surface-2]">
        <Navigation size={16} className="text-brand-500" /> Directions
      </a>

      {station.status === "active" ? (
        <Link href={`/app/book/${station.id}`} className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-lg transition hover:bg-brand-600">
          Book Now <ArrowRight size={18} />
        </Link>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-[--border] bg-white px-4 py-3 text-center text-sm text-ink-muted">
          This station isn&rsquo;t accepting bookings right now.
        </div>
      )}
    </main>
  );
}
