"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { registerMember, type AuthState } from "@/app/actions/member-auth";
import { ChevronLeft } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? "Creating account…" : "Join Emerald H2"}
    </button>
  );
}

const inputCls = "w-full rounded-xl border border-[--border] bg-surface px-3 py-3 text-ink outline-none focus:border-brand-400";

export default function RegisterPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(registerMember, {});

  return (
    <main className="flex min-h-[100dvh] flex-col px-7 pb-10 pt-8" style={{ background: "var(--ground)" }}>
      <Link href="/app/signin" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="mt-6">
        <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-muted">Free to join — no cost, no obligation. You&rsquo;ll take a short safety test next.</p>
      </div>

      {state?.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}

      <form action={formAction} className="mt-5 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">First name</span>
            <input name="firstName" required placeholder="Jane" className={inputCls} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Last name</span>
            <input name="lastName" placeholder="Driver" className={inputCls} /></label>
        </div>
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Email</span>
          <input name="email" type="email" required placeholder="you@example.com" className={inputCls} /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Cell number</span>
          <input name="phone" type="tel" placeholder="(937) 555-0100" className={inputCls} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Password</span>
            <input name="password" type="password" required placeholder="••••••••" className={inputCls} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Zip code</span>
            <input name="zip" placeholder="45405" className={inputCls} /></label>
        </div>
        <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Referral code <span className="text-ink-muted">(optional)</span></span>
          <input name="referral" placeholder="6-digit member code" className={inputCls} /></label>
        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        Already a member? <Link href="/app/signin" className="font-semibold text-brand-600">Sign in</Link>
      </p>
    </main>
  );
}
