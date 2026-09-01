import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { updateProfile } from "@/app/actions/community";
import { logoutMember } from "@/app/actions/member-auth";
import { MemberTabBar } from "@/components/MemberTabBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/ui";
import { Save, ExternalLink, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

const input = "w-full rounded-xl border border-[--border] bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400";

export default async function ProfilePage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const member = await prisma.member.findUnique({ where: { id: Number(session.sub) } });
  if (!member) redirect("/app/signin");

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      <div className="flex-1 px-6 pb-6 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">Your profile</h1>
          <Link href={`/app/members/${member.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
            View public <ExternalLink size={12} />
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Avatar name={member.name} size={64} />
          <div>
            <p className="font-display font-semibold text-ink">{member.name}</p>
            <p className="text-xs text-ink-muted">#{member.membershipCode} · {member.tier}</p>
          </div>
        </div>

        <form action={updateProfile} className="mt-5 flex flex-col gap-3">
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Display name</span>
            <input name="name" defaultValue={member.name} className={input} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Headline</span>
            <input name="headline" defaultValue={member.headline || ""} placeholder="e.g. Fuel Cell Engineer · MRE" className={input} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">About</span>
            <textarea name="bio" defaultValue={member.bio || ""} rows={3} placeholder="Tell the community about your work in hydrogen…" className={`${input} resize-none`} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Company</span>
              <input name="company" defaultValue={member.company || ""} className={input} /></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Role</span>
              <input name="jobTitle" defaultValue={member.jobTitle || ""} className={input} /></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">City</span>
              <input name="city" defaultValue={member.city || ""} className={input} /></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">State</span>
              <input name="state" defaultValue={member.state || ""} className={input} /></label>
          </div>
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink-soft">Phone</span>
            <input name="phone" defaultValue={member.phone || ""} className={input} /></label>

          <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-display text-base font-bold text-white shadow-sm transition hover:bg-brand-600">
            <Save size={17} /> Save profile
          </button>
        </form>

        <div className="mt-4"><ThemeToggle /></div>

        <form action={logoutMember} className="mt-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[--border] bg-surface py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
            <LogOut size={16} /> Log out
          </button>
        </form>
      </div>
      <MemberTabBar />
    </div>
  );
}
