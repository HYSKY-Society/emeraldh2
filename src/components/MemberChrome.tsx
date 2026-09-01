"use client";

import { usePathname } from "next/navigation";
import { MemberSidebar } from "@/components/MemberSidebar";
import { cn } from "@/lib/utils";

// Full-screen auth / onboarding flows: no sidebar, keep the phone frame even on desktop.
const BARE_PREFIXES = ["/app/signin", "/app/register", "/app/training"];
// Pages that get a wide, multi-column desktop layout (others read in a comfortable column).
const WIDE = new Set(["/app/home", "/app/members", "/app/find", "/app/bookings", "/app/events", "/app/notifications"]);
// Route subtrees that are always wide (e.g. the messages two-pane, list + open thread).
const WIDE_PREFIXES = ["/app/messages"];

export function MemberChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBare = pathname === "/app" || BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isBare) {
    return (
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[480px] overflow-hidden shadow-xl" style={{ background: "var(--ground)" }}>
        {children}
      </div>
    );
  }

  const wide = WIDE.has(pathname) || WIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <div className="flex min-h-[100dvh]" style={{ background: "var(--ground)" }}>
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] shrink-0 lg:block">
        <MemberSidebar />
      </aside>

      {/* content — phone frame on mobile, full-width column on desktop */}
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "relative mx-auto min-h-[100dvh] w-full max-w-[480px] overflow-hidden shadow-xl",
            "lg:overflow-visible lg:shadow-none",
            wide ? "lg:max-w-[1200px]" : "lg:max-w-3xl"
          )}
          style={{ background: "var(--ground)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
