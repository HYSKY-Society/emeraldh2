"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminShell({ adminName, children }: { adminName: string; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="lg:pl-[264px]">
        <Topbar adminName={adminName} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-[1200px] px-4 pb-8 pt-2 text-center text-xs text-ink-muted sm:px-6">
          Copyright © MREH2.COM. All rights reserved. · Emerald H2 admin (Next.js rebuild)
        </footer>
      </div>
    </div>
  );
}
