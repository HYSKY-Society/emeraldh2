"use client";

import { useTransition } from "react";
import { rsvpEvent } from "@/app/actions/social";
import { Check, CalendarPlus } from "lucide-react";

export function RsvpButton({ eventId, going }: { eventId: number; going: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => rsvpEvent(eventId))}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        going ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/20" : "bg-brand-500 text-white hover:bg-brand-600"
      }`}
    >
      {going ? <><Check size={15} /> Going</> : <><CalendarPlus size={15} /> RSVP</>}
    </button>
  );
}
