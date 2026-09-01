import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { deletePost } from "@/app/actions/community";
import { PostComposer } from "@/components/PostComposer";
import { LikeButton } from "@/components/LikeButton";
import { MemberTabBar } from "@/components/MemberTabBar";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  const memberId = Number(session.sub);

  const me = await prisma.member.findUnique({ where: { id: memberId } });
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      member: { select: { id: true, name: true, headline: true } },
      reactions: { select: { memberId: true } },
    },
  });

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--ground)" }}>
      <div className="flex-1 px-5 pb-6 pt-6">
        <h1 className="font-display text-2xl font-bold text-ink">Community</h1>
        <p className="mb-4 text-sm text-ink-muted">Updates and conversations from the Emerald H2 community.</p>

        <PostComposer name={me?.name || "there"} />

        <div className="mt-4 flex flex-col gap-3">
          {posts.map((p) => {
            const liked = p.reactions.some((r) => r.memberId === memberId);
            return (
              <div key={p.id} className="rounded-2xl border border-[--border] bg-surface p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <Avatar name={p.member.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/app/members/${p.member.id}`} className="truncate font-display text-sm font-semibold text-ink hover:text-brand-600">
                        {p.member.name}
                      </Link>
                      <span className="shrink-0 text-xs text-ink-muted">{timeAgo(p.createdAt)}</span>
                    </div>
                    {p.member.headline && <p className="truncate text-xs text-ink-muted">{p.member.headline}</p>}
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                <div className="mt-3 flex items-center justify-between border-t border-[--border] pt-3">
                  <LikeButton postId={p.id} count={p.reactions.length} liked={liked} />
                  {p.member.id === memberId && (
                    <ConfirmButton
                      action={deletePost.bind(null, p.id)}
                      confirmText="Delete this post?"
                      className="text-ink-muted hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </ConfirmButton>
                  )}
                </div>
              </div>
            );
          })}
          {posts.length === 0 && (
            <p className="rounded-xl border border-dashed border-[--border] bg-surface px-4 py-8 text-center text-sm text-ink-muted">
              No posts yet — be the first to share something.
            </p>
          )}
        </div>
      </div>
      <MemberTabBar />
    </div>
  );
}
