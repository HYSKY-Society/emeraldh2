"use client";

import { cn } from "@/lib/utils";

export function ConfirmButton({
  action,
  confirmText,
  children,
  className,
}: {
  action: () => Promise<void>;
  confirmText: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className={cn(className)}>
        {children}
      </button>
    </form>
  );
}

export function ActionButton({
  action,
  children,
  className,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form action={action}>
      <button type="submit" className={cn(className)}>
        {children}
      </button>
    </form>
  );
}
