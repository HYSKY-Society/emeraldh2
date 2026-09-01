import Link from "next/link";
import { InstallButton } from "@/components/pwa";
import { MapPin, ShieldCheck, Users, ArrowRight } from "lucide-react";

export default function GetStartedPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col text-white">
      {/* atmospheric hydrogen-green backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 20% -10%, rgba(47,176,105,.45), transparent 55%), radial-gradient(700px 500px at 110% 110%, rgba(24,119,168,.4), transparent 55%), linear-gradient(165deg,#0b3f26,#0a2a1c)",
        }}
      />
      <div className="relative flex min-h-[100dvh] flex-col px-7 pb-10 pt-14">
        {/* brand */}
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 font-display text-lg font-extrabold">H₂</span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            EMERALD <span className="text-brand-300">H2</span>
          </span>
        </div>

        {/* hero */}
        <div className="flex flex-1 flex-col justify-center py-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-300">The energy to change the world</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] tracking-tight">
            Fuel Up<br />Smarter.
          </h1>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/80">
            Schedule fueling from anywhere, drive to the Emerald H2 station, fill up the tank, and you&rsquo;re ready to go.
          </p>

          <ul className="mt-7 flex flex-col gap-3 text-sm text-white/85">
            <li className="flex items-center gap-3"><MapPin size={17} className="text-brand-300" /> Find active hydrogen stations near you</li>
            <li className="flex items-center gap-3"><ShieldCheck size={17} className="text-brand-300" /> Reserve fuel with your personal code</li>
            <li className="flex items-center gap-3"><Users size={17} className="text-brand-300" /> Join the Emerald H2 community</li>
          </ul>
        </div>

        {/* actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/app/signin"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-lg transition hover:bg-brand-400"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <InstallButton className="flex justify-center" />
          <p className="mt-1 text-center text-xs text-white/55">Powered by Millennium Reign Energy · MREH2.COM</p>
        </div>
      </div>
    </main>
  );
}
