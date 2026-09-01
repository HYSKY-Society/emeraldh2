"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { Menu, KeyRound, LogOut, ChevronDown, UserCircle2 } from "lucide-react";

export default function Topbar({ adminName, onOpenSidebar }: { adminName: string; onOpenSidebar: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[--border] bg-white/85 px-4 backdrop-blur">
      <button onClick={onOpenSidebar} className="rounded-lg p-2 text-ink-soft hover:bg-[--surface-2] lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-[--surface-2]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">
              <UserCircle2 size={18} />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-semibold leading-4 text-ink">{adminName}</span>
              <span className="block text-[11px] leading-4 text-ink-muted">Administrator</span>
            </span>
            <ChevronDown size={15} className="text-ink-muted" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 z-20 mt-1.5 w-52 overflow-hidden rounded-xl border border-[--border] bg-white shadow-lg">
                <Link href="/admin/settings" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-soft hover:bg-[--surface-2]">
                  <KeyRound size={15} /> Settings
                </Link>
                <div className="border-t border-[--border]" />
                <form action={logoutAction}>
                  <button type="submit" className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={15} /> Log out
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
