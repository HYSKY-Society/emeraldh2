import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { DEFAULT_CENTER } from "@/lib/geo";
import Finder from "@/components/Finder";
import { MemberTabBar } from "@/components/MemberTabBar";

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
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      <div className="flex-1 px-5 pb-6 pt-6">
        <h1 className="mb-4 font-display text-2xl font-bold text-ink">Find a station</h1>
        <Finder stations={data} center={DEFAULT_CENTER} />
      </div>
      <MemberTabBar />
    </div>
  );
}
