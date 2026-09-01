import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { DEFAULT_CENTER } from "@/lib/geo";
import Finder from "@/components/Finder";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FindPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const [stations, favs] = await Promise.all([
    prisma.station.findMany({ where: { latitude: { not: null }, longitude: { not: null } }, orderBy: { id: "asc" } }),
    prisma.favorite.findMany({ where: { memberId }, select: { stationId: true } }),
  ]);
  const favSet = new Set(favs.map((f) => f.stationId));

  const data = stations.map((s) => ({
    id: s.id,
    title: s.title,
    address: s.address,
    latitude: s.latitude as number,
    longitude: s.longitude as number,
    status: s.status,
    pricePerKg: s.pricePerKg,
    timings: s.timings,
    favorite: favSet.has(s.id),
  }));

  return (
    <main className="min-h-[100dvh] px-5 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <h1 className="mb-4 mt-3 font-display text-2xl font-bold text-ink">Find a station</h1>
      <Finder stations={data} center={DEFAULT_CENTER} />
    </main>
  );
}
