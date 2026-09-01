import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Card, CardHeader, Table, Th, Td, Avatar, EmptyState } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Gift, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReferEarnPage() {
  const [topReferrers, earningsAgg, referredCount] = await Promise.all([
    prisma.member.findMany({
      where: { referrals: { some: {} } },
      include: { _count: { select: { referrals: true } } },
      orderBy: { referralEarnings: "desc" },
      take: 15,
    }),
    prisma.member.aggregate({ _sum: { referralEarnings: true } }),
    prisma.member.count({ where: { referredById: { not: null } } }),
  ]);

  return (
    <>
      <PageHeader
        title="Refer & Earn"
        breadcrumb={["Home", "Refer and Earn"]}
        subtitle="Members earn credits (emeralds) for referring others. Each member's referral code is part of their membership code."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="flex items-center gap-2 font-mono text-[11px] uppercase text-ink-muted"><Gift size={13} /> Total Earnings</p><p className="mt-1 font-display text-2xl font-bold text-ink">{formatCurrency(earningsAgg._sum.referralEarnings ?? 0)}</p></Card>
        <Card className="p-5"><p className="flex items-center gap-2 font-mono text-[11px] uppercase text-ink-muted"><Users size={13} /> Referred Members</p><p className="mt-1 font-display text-2xl font-bold text-ink">{referredCount}</p></Card>
        <Card className="p-5"><p className="flex items-center gap-2 font-mono text-[11px] uppercase text-ink-muted"><TrendingUp size={13} /> Active Referrers</p><p className="mt-1 font-display text-2xl font-bold text-ink">{topReferrers.length}</p></Card>
      </div>

      <Card>
        <CardHeader title="Top referrers" />
        {topReferrers.length === 0 ? (
          <EmptyState title="No referrals yet" hint="Referral activity will appear here." />
        ) : (
          <Table>
            <thead><tr><Th>Member</Th><Th>Code</Th><Th>Referrals</Th><Th>Earnings</Th></tr></thead>
            <tbody>
              {topReferrers.map((m) => (
                <tr key={m.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} size={32} />
                      <Link href={`/admin/users/${m.id}`} className="font-semibold text-ink hover:text-brand-600">{m.name}</Link>
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{m.membershipCode}</Td>
                  <Td className="tabular">{m._count.referrals}</Td>
                  <Td className="tabular font-semibold">{formatCurrency(m.referralEarnings)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
