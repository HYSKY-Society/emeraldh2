"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name] ?? Icons.Circle;
  return <C size={17} className={className} />;
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[264px] flex-col bg-brand-900 text-white/90"
      style={{ background: "linear-gradient(185deg,#0b3f26 0%,#0a2f1f 60%,#092619 100%)" }}>
      {/* brand */}
      <Link href="/admin/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-500 font-display text-base font-extrabold text-white">H₂</span>
        <span className="font-display text-lg font-extrabold tracking-tight">
          EMERALD <span className="text-brand-300">H2</span>
        </span>
      </Link>
      <div className="mx-5 border-t border-white/10" />

      {/* nav */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-3">
        {NAV.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="px-3 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition",
                        active ? "bg-white/12 text-white shadow-sm" : "text-white/70 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      <Icon name={item.icon} className={cn(active ? "text-brand-300" : "text-white/55 group-hover:text-white/80")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mx-5 border-t border-white/10" />
      <a href="http://13.234.173.183/emeraldh2" target="_blank" rel="noreferrer"
        className="flex items-center gap-2 px-5 py-3 text-xs text-white/55 hover:text-white/80">
        <Icons.ExternalLink size={13} /> Visit public website
      </a>
    </div>
  );
}
