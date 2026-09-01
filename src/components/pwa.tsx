"use client";

import { useEffect, useState } from "react";
import { Download, Check } from "lucide-react";

/** Registers the service worker once, on mount. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** "Install app" button — uses beforeinstallprompt on Android/desktop, shows an
 *  iOS hint otherwise. Hides itself once installed. */
export function InstallButton({ className }: { className?: string }) {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm text-white/80 ${className || ""}`}>
        <Check size={16} /> App installed
      </span>
    );
  }

  const handle = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else if (isIOS) {
      setShowIOSHint(true);
    }
  };

  if (!deferred && !isIOS) return null;

  return (
    <div className={className}>
      <button
        onClick={handle}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
      >
        <Download size={16} /> Install app
      </button>
      {showIOSHint && (
        <p className="mt-2 text-xs text-white/75">
          On iPhone: tap the Share button, then <strong>Add to Home Screen</strong>.
        </p>
      )}
    </div>
  );
}
