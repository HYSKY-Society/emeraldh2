import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Field, Input, Textarea, Button } from "@/components/ui";
import { saveHomepage } from "@/app/actions/crud";
import { Save, Users, Fuel, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomepagePage() {
  const [setting, memberCount, activeStations, newsCount] = await Promise.all([
    prisma.setting.findUnique({ where: { id: 1 } }),
    prisma.member.count(),
    prisma.station.count({ where: { status: "active" } }),
    prisma.newsMedia.count({ where: { status: "published" } }),
  ]);

  return (
    <>
      <PageHeader title="Homepage Management" breadcrumb={["Home", "Homepage"]} subtitle="Edit the public homepage hero and see the live counters that drive it." />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="flex items-center gap-2 font-mono text-[11px] uppercase text-ink-muted"><Users size={13} /> Member Ticker</p><p className="mt-1 font-display text-3xl font-extrabold text-ink">{memberCount}</p></Card>
        <Card className="p-5"><p className="flex items-center gap-2 font-mono text-[11px] uppercase text-ink-muted"><Fuel size={13} /> Active Stations</p><p className="mt-1 font-display text-3xl font-extrabold text-ink">{activeStations}</p></Card>
        <Card className="p-5"><p className="flex items-center gap-2 font-mono text-[11px] uppercase text-ink-muted"><Newspaper size={13} /> Published News</p><p className="mt-1 font-display text-3xl font-extrabold text-ink">{newsCount}</p></Card>
      </div>

      <Card className="max-w-2xl">
        <CardHeader title="Hero section" />
        <form action={saveHomepage} className="flex flex-col gap-4 p-5">
          <Field label="Tagline" hint="Small line above the hero."><Input name="heroTagline" defaultValue={setting?.heroTagline || ""} /></Field>
          <Field label="Hero title"><Input name="heroTitle" defaultValue={setting?.heroTitle || ""} /></Field>
          <Field label="Hero subtitle"><Textarea name="heroSubtitle" rows={4} defaultValue={setting?.heroSubtitle || ""} /></Field>
          <div><Button type="submit"><Save size={16} /> Save Homepage</Button></div>
        </form>
      </Card>
    </>
  );
}
