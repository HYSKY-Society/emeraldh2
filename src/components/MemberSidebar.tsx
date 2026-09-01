"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_NAV } from "@/lib/member-nav";
import { logoutMember } from "@/app/actions/member-auth";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name] ?? Icons.Circle;
  return <C size={17} className={className} />;
}

export function MemberSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-full w-[248px] flex-col text-white/90"
      style={{ background: "linear-gradient(185deg,#0b3f26 0%,#0a2f1f 60%,#092619 100%)" }}
    >
      {/* brand */}
      <Link href="/app/home" onClick={onNavigate} className="flex items-center gap-2.5 px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-500 font-display text-base font-extrabold text-white">H₂</span>
        <span className="font-display text-lg font-extrabold tracking-tight">
          EMERALD <span className="text-brand-300">H2</span>
        </span>
      </Link>
      <div className="mx-5 border-t border-white/10" />

      {/* nav */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-3">
        {MEMBER_NAV.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="px-3 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
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
      <form action={logoutMember}>
        <button className="flex w-full items-center gap-2 px-5 py-3.5 text-xs font-medium text-white/55 transition hover:text-white/90">
          <Icons.LogOut size={14} /> Log out
        </button>
      </form>
    </div>
  );
}
