import { prisma } from "@/lib/db";
import { PageHeader, Card, StatusBadge, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { deleteCarApplication } from "@/app/actions/crud";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Trash2, User, Briefcase, Landmark, FileSignature } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CarApplicationsPage() {
  const apps = await prisma.carApplication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Car Financing Applications"
        breadcrumb={["Home", "Membership", "Buy A Car"]}
        subtitle="Full vehicle-financing applications. Contains sensitive personal & financial data — handle per your data-retention policy."
      />

      {apps.length === 0 ? (
        <Card><EmptyState title="No applications yet" hint="Submitted car-financing applications will appear here." /></Card>
      ) : (
        <div className="flex flex-col gap-4">
          {apps.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[--border] bg-[--surface-2]/40 px-5 py-3">
                <div className="flex items-center gap-2">
                  <FileSignature size={16} className="text-brand-500" />
                  <span className="font-display font-semibold text-ink">{a.name}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted">{formatDateTime(a.createdAt)}</span>
                  <ConfirmButton action={deleteCarApplication.bind(null, a.id)} confirmText={`Delete ${a.name}'s application?`} className="rounded-md p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></ConfirmButton>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted"><User size={13} /> Personal</p>
                  <dl className="space-y-1 text-sm">
                    <Row k="Phone" v={a.phone} /><Row k="Email" v={a.email} /><Row k="Address" v={a.address} />
                    <Row k="Marital status" v={a.maritalStatus} />
                    <Row k="Working" v={a.working ? "Yes" : "No"} />
                    <Row k="Company" v={a.company} /><Row k="Position" v={a.position} /><Row k="Department" v={a.department} />
                  </dl>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted"><Briefcase size={13} /> Financial</p>
                  <dl className="space-y-1 text-sm">
                    <Row k="Home status" v={a.homeStatus} />
                    <Row k="Current loan" v={a.hasCurrentLoan ? "Yes" : "No"} />
                    <Row k="Monthly income" v={a.monthlyIncome != null ? formatCurrency(a.monthlyIncome) : null} />
                    <Row k="Loan bank" v={a.loanBank} />
                    <Row k="Months left" v={a.loanMonthsLeft != null ? String(a.loanMonthsLeft) : null} />
                    <Row k="Monthly amount" v={a.loanMonthlyAmt != null ? formatCurrency(a.loanMonthlyAmt) : null} />
                  </dl>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted"><Landmark size={13} /> Requested loan</p>
                  <dl className="space-y-1 text-sm">
                    <Row k="Type" v={a.loanType} />
                    <Row k="Amount" v={a.loanAmount != null ? formatCurrency(a.loanAmount) : null} />
                    <Row k="Terms" v={a.loanTerms} />
                    <Row k="Preferred payment" v={a.preferredPayment} />
                  </dl>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-muted">{k}</dt>
      <dd className="text-right font-medium text-ink-soft">{v || "—"}</dd>
    </div>
  );
}
