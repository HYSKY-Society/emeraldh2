"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage } from "@/app/actions/social";
import { Send } from "lucide-react";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 disabled:opacity-60" aria-label="Send">
      <Send size={17} />
    </button>
  );
}

export function MessageComposer({ recipientId }: { recipientId: number }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await sendMessage(recipientId, fd);
        ref.current?.reset();
      }}
      className="sticky bottom-0 flex items-center gap-2 border-t border-[--border] bg-surface px-4 py-3 backdrop-blur"
    >
      <input
        name="body"
        required
        autoComplete="off"
        maxLength={2000}
        placeholder="Message…"
        className="min-w-0 flex-1 rounded-full border border-[--border] bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
      />
      <SubmitBtn />
    </form>
  );
}
