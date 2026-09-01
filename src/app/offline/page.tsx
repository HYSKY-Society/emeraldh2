import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = { title: "Offline — Emerald H2" };

export default function OfflinePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: "var(--ground)" }}>
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <WifiOff size={26} />
      </span>
      <h1 className="font-display text-xl font-bold text-ink">You&rsquo;re offline</h1>
      <p className="max-w-xs text-sm text-ink-muted">
        Emerald H2 needs a connection for this. Your last-viewed stations and training stay available — reconnect to book fuel.
      </p>
      <Link href="/app" className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
        Try again
      </Link>
    </main>
  );
}
