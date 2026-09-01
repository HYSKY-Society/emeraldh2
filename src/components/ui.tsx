import Link from "next/link";
import { cn, initials, hueFromString } from "@/lib/utils";

/* ---------------- Page header ---------------- */
export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  action,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {breadcrumb && (
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">{breadcrumb.join("  /  ")}</p>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

/* ---------------- Card ---------------- */
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-[--border] bg-surface shadow-card", className)}>{children}</div>;
}
export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[--border] px-5 py-3.5">
      <h2 className="font-display text-[15px] font-semibold text-ink">{title}</h2>
      {action}
    </div>
  );
}

/* ---------------- Buttons ---------------- */
const btnBase = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:opacity-60";
export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "outline" }) {
  const styles = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
    outline: "border border-[--border] bg-surface text-ink-soft hover:bg-[--surface-2]",
    ghost: "text-ink-soft hover:bg-[--surface-2]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];
  return (
    <button className={cn(btnBase, styles, className)} {...props}>
      {children}
    </button>
  );
}
export function LinkButton({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
}) {
  const styles = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
    outline: "border border-[--border] bg-surface text-ink-soft hover:bg-[--surface-2]",
    ghost: "text-ink-soft hover:bg-[--surface-2]",
  }[variant];
  return (
    <Link href={href} className={cn(btnBase, styles, className)}>
      {children}
    </Link>
  );
}

/* ---------------- Status badge ---------------- */
const STATUS_MAP: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  received: "bg-sky-50 text-sky-700 ring-sky-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  maintenance: "bg-amber-50 text-amber-700 ring-amber-600/20",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/20",
  inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  new: "bg-sky-50 text-sky-700 ring-sky-600/20",
  offline: "bg-red-50 text-red-700 ring-red-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
};
export function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase();
  const cls = STATUS_MAP[key] ?? "bg-slate-100 text-slate-600 ring-slate-500/20";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset", cls)}>
      {status}
    </span>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const hue = hueFromString(name);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${hue} 45% 45%)` }}
    >
      {initials(name)}
    </span>
  );
}

/* ---------------- Table ---------------- */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap border-b border-[--border] px-4 py-2.5 text-left font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-muted", className)}>
      {children}
    </th>
  );
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-[--border] px-4 py-3 align-middle text-ink-soft", className)}>{children}</td>;
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-14 text-center">
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}

/* ---------------- Form fields ---------------- */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}
const inputCls = "w-full rounded-lg border border-[--border] bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-400";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "min-h-[96px]", props.className)} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, props.className)} />;
}
