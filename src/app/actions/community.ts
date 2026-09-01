"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";

async function requireMember() {
  const s = await getMemberSession();
  if (!s) redirect("/app/signin");
  return Number(s.sub);
}

/* ---------------- Feed ---------------- */
export async function createPost(formData: FormData) {
  const memberId = await requireMember();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  await prisma.post.create({ data: { memberId, body: body.slice(0, 3000) } });
  revalidatePath("/app/community");
}

export async function deletePost(id: number) {
  const memberId = await requireMember();
  const post = await prisma.post.findUnique({ where: { id } });
  if (post && post.memberId === memberId) {
    await prisma.post.delete({ where: { id } });
  }
  revalidatePath("/app/community");
}

export async function toggleLike(postId: number) {
  const memberId = await requireMember();
  const existing = await prisma.reaction.findUnique({
    where: { postId_memberId_type: { postId, memberId, type: "like" } },
  });
  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({ data: { postId, memberId, type: "like" } });
  }
  revalidatePath("/app/community");
}

/* ---------------- Profile ---------------- */
export async function updateProfile(formData: FormData) {
  const memberId = await requireMember();
  const name = String(formData.get("name") || "").trim();
  await prisma.member.update({
    where: { id: memberId },
    data: {
      name: name || undefined,
      headline: String(formData.get("headline") || ""),
      bio: String(formData.get("bio") || ""),
      company: String(formData.get("company") || ""),
      jobTitle: String(formData.get("jobTitle") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      phone: String(formData.get("phone") || ""),
    },
  });
  revalidatePath("/app/profile");
  revalidatePath(`/app/members/${memberId}`);
  redirect("/app/profile");
}
