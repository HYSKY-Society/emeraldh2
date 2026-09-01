"use client";

import { useEffect, useState } from "react";
import { savePushSubscription } from "@/app/actions/booking";
import { Bell, BellRing } from "lucide-react";

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

type State = "unknown" | "unsupported" | "on" | "off" | "denied" | "working";

export function PushToggle() {
  const [state, setState] = useState<State>("unknown");

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") return setState("denied");
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("off"));
  }, []);

  async function enable() {
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key) return;
    try {
      setState("working");
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return setState(perm === "denied" ? "denied" : "off");
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(key),
        });
      }
      const json = sub.toJSON();
      await savePushSubscription({
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
      });
      setState("on");
    } catch {
      setState("off");
    }
  }

  if (state === "unsupported" || state === "unknown") return null;

  if (state === "on") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[--border] bg-surface px-4 py-3 text-sm text-ink-soft shadow-card">
        <BellRing size={16} className="text-brand-500" /> Notifications are on
      </div>
    );
  }

  return (
    <button
      onClick={enable}
      disabled={state === "working"}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[--border] bg-surface px-4 py-3 text-sm font-semibold text-ink-soft shadow-card transition hover:bg-[--surface-2] disabled:opacity-60"
    >
      <Bell size={16} className="text-brand-500" />
      {state === "working" ? "Enabling…" : state === "denied" ? "Notifications blocked — enable in browser settings" : "Enable notifications"}
    </button>
  );
}
