"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const t = next ? "dark" : "light";
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("eh2-theme", t);
    } catch {
      /* private mode */
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-xl border border-[--border] bg-surface px-4 py-3 text-sm font-semibold text-ink-soft shadow-card transition hover:bg-[--surface-2]"
    >
      <span className="flex items-center gap-2">
        {dark ? <Moon size={16} className="text-brand-500" /> : <Sun size={16} className="text-brand-500" />} Appearance
      </span>
      <span className="text-ink-muted">{dark ? "Dark" : "Light"}</span>
    </button>
  );
}
