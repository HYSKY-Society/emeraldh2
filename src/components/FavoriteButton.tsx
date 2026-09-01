"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/actions/booking";
import { Star } from "lucide-react";

export function FavoriteButton({ stationId, favorite }: { stationId: number; favorite: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => toggleFavorite(stationId))}
      disabled={pending}
      aria-pressed={favorite}
      className="grid h-10 w-10 place-items-center rounded-xl border border-[--border] bg-surface transition hover:bg-[--surface-2] disabled:opacity-50"
    >
      <Star size={18} className={favorite ? "fill-amber-400 text-amber-400" : "text-ink-muted"} />
    </button>
  );
}
