"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

export function ReferShare({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const message = `Join me on Emerald H2 — the green hydrogen fueling network. Use my referral code ${code} when you sign up.`;

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Emerald H2", text: message });
      } catch {
        /* dismissed */
      }
    } else {
      copy();
    }
  }

  return (
    <div className="flex gap-2">
      <button onClick={share} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
        <Share2 size={16} /> Share invite
      </button>
      <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[--border] bg-surface px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-[--surface-2]">
        {copied ? <Check size={16} className="text-brand-500" /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
