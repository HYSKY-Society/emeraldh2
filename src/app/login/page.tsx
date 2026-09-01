"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Leaf, LogIn } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
    >
      <LogIn size={18} />
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-900 px-4">
      {/* atmospheric backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(1200px 600px at 15% -10%, rgba(47,176,105,.35), transparent 55%), radial-gradient(900px 500px at 110% 120%, rgba(24,119,168,.35), transparent 55%), linear-gradient(160deg,#0b3f26,#0a2a1c)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-500 font-display text-lg font-extrabold">H₂</span>
          <span className="font-display text-2xl font-extrabold tracking-tight">
            EMERALD <span className="text-brand-300">H2</span>
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-7 shadow-2xl backdrop-blur">
          <div className="mb-5">
            <h1 className="font-display text-2xl font-bold text-ink">Admin sign in</h1>
            <p className="mt-1 text-sm text-ink-muted">Sign in to manage the hydrogen network.</p>
          </div>

          {state?.error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
          )}

          <form action={formAction} className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-soft">
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue="admin@ogrelogic.com"
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg border border-[--border] bg-white px-3 py-2.5 text-ink outline-none focus:border-brand-400"
              />
            </label>
            <label className="text-sm font-medium text-ink-soft">
              Password
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-[--border] bg-white px-3 py-2.5 text-ink outline-none focus:border-brand-400"
              />
            </label>
            <SubmitButton />
          </form>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted">
            <Leaf size={13} className="text-brand-500" />
            Green hydrogen fueling network · MREH2.COM
          </p>
        </div>
      </div>
    </main>
  );
}
