"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { loginMember, type AuthState } from "@/app/actions/member-auth";
import { ChevronLeft, Mail, Lock } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3.5 font-display text-base font-bold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function AppSignInPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(loginMember, {});

  return (
    <main className="flex min-h-[100dvh] flex-col px-7 pb-10 pt-8" style={{ background: "var(--ground)" }}>
      <Link href="/app" className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 font-display text-lg font-extrabold text-white">H₂</span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            EMERALD <span className="text-brand-500">H2</span>
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-ink-muted">Welcome back — let&rsquo;s get you fueling.</p>
      </div>

      {state?.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}

      <form action={formAction} className="mt-5 flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink-soft">Email</span>
          <span className="relative block">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-[--border] bg-white py-3 pl-9 pr-3 text-ink outline-none focus:border-brand-400" />
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink-soft">Password</span>
          <span className="relative block">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input name="password" type="password" required placeholder="••••••••" className="w-full rounded-xl border border-[--border] bg-white py-3 pl-9 pr-3 text-ink outline-none focus:border-brand-400" />
          </span>
        </label>
        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        New here? <Link href="/app/register" className="font-semibold text-brand-600">Create an account</Link>
      </p>

      <div className="mt-auto rounded-xl border border-dashed border-[--border] bg-white/60 px-4 py-3 text-center text-xs text-ink-muted">
        Demo: any seeded member email (e.g. <b>hydrogenchris@gmail.com</b>) with password <b>emerald123</b>.
      </div>
    </main>
  );
}
