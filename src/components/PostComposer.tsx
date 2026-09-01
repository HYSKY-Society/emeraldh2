"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "@/app/actions/community";
import { Send } from "lucide-react";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
    >
      <Send size={15} /> {pending ? "Posting…" : "Post"}
    </button>
  );
}

export function PostComposer({ name }: { name: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await createPost(fd);
        ref.current?.reset();
      }}
      className="rounded-2xl border border-[--border] bg-white p-4 shadow-card"
    >
      <textarea
        name="body"
        required
        maxLength={3000}
        rows={3}
        placeholder={`Share something with the community, ${name.split(" ")[0]}…`}
        className="w-full resize-none rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-400"
      />
      <div className="mt-2 flex justify-end">
        <SubmitBtn />
      </div>
    </form>
  );
}
