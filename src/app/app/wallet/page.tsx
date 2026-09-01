import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { topUpWallet } from "@/app/actions/booking";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, Wallet, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const AMOUNTS = [50, 100, 150, 300];

export default async function WalletPage({ searchParams }: { searchParams: { need?: string; station?: string; qty?: string } }) {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const member = await prisma.member.findUnique({ where: { id: Number(session.sub) } });
  if (!member) redirect("/app/signin");

  const need = searchParams.need ? Number(searchParams.need) : 0;
  const shortfall = Math.max(0, need - member.walletBalance);

  return (
    <main className="min-h-[100dvh] px-6 pb-10 pt-6" style={{ background: "var(--ground)" }}>
      <Link href="/app/home" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Home
      </Link>
      <h1 className="mb-4 mt-3 font-display text-2xl font-bold text-ink">Wallet</h1>

      <div className="overflow-hidden rounded-2xl p-6 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0b3f26,#0b8a4b)" }}>
        <span className="flex items-center gap-1.5 text-sm text-white/80"><Wallet size={15} /> Fuel balance</span>
        <p className="mt-2 font-display text-4xl font-extrabold tabular">{formatCurrency(member.walletBalance)}</p>
      </div>

      {shortfall > 0 && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          You need {formatCurrency(shortfall)} more to complete that booking. Top up below.
        </p>
      )}

      <p className="mt-5 text-sm font-medium text-ink-soft">Add balance (demo — no real charge)</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {AMOUNTS.map((a) => (
          <form key={a} action={topUpWallet}>
            <input type="hidden" name="amount" value={a} />
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl border border-[--border] bg-white py-4 font-display text-lg font-bold text-ink shadow-card transition hover:border-brand-400 hover:bg-brand-50">
              <Plus size={16} className="text-brand-500" /> {formatCurrency(a)}
            </button>
          </form>
        ))}
      </div>

      {searchParams.station && (
        <Link href={`/app/book/${searchParams.station}`} className="mt-5 flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-lg transition hover:bg-brand-600">
          Back to booking
        </Link>
      )}
    </main>
  );
}
