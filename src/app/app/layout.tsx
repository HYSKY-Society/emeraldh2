import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistrar } from "@/components/pwa";

export const metadata: Metadata = {
  title: "Emerald H2",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Emerald H2" },
};

export const viewport: Viewport = {
  themeColor: "#0b8a4b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto min-h-[100dvh] max-w-[480px] overflow-hidden shadow-xl" style={{ background: "var(--ground)" }}>
      <ServiceWorkerRegistrar />
      {children}
    </div>
  );
}
