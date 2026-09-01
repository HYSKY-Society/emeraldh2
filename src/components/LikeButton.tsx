"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/actions/community";
import { Heart } from "lucide-react";

export function LikeButton({ postId, count, liked }: { postId: number; count: number; liked: boolean }) {
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { count, liked },
    (_s, next: { count: number; liked: boolean }) => next
  );

  return (
    <button
      onClick={() =>
        start(() => {
          setOptimistic({ liked: !optimistic.liked, count: optimistic.count + (optimistic.liked ? -1 : 1) });
          return toggleLike(postId);
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-brand-600"
    >
      <Heart size={16} className={optimistic.liked ? "fill-brand-500 text-brand-500" : ""} />
      {optimistic.count}
    </button>
  );
}
