"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, MessagesSquare, Users2, User } from "lucide-react";

const TABS = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/find", label: "Find", icon: MapPin },
  { href: "/app/community", label: "Community", icon: MessagesSquare },
  { href: "/app/members", label: "Members", icon: Users2 },
  { href: "/app/profile", label: "Profile", icon: User },
];

export function MemberTabBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 mt-4 grid grid-cols-5 border-t border-[--border] bg-white/95 backdrop-blur">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${active ? "text-brand-600" : "text-ink-muted hover:text-ink-soft"}`}
          >
            <Icon size={20} className={active ? "text-brand-600" : ""} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
