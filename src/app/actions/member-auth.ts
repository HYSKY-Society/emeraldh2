"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createMemberSession, destroyMemberSession, getMemberSession } from "@/lib/member-auth";

export type AuthState = { error?: string };

function membershipCode() {
  return String(100000 + Math.floor(Date.now() % 900000));
}

export async function loginMember(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email and password are required." };

  const member = await prisma.member.findUnique({ where: { email } });
  if (!member || !member.passwordHash) return { error: "No account found for that email." };
  if (!member.isActive) return { error: "This account is inactive. Contact support." };

  const ok = await bcrypt.compare(password, member.passwordHash);
  if (!ok) return { error: "Incorrect password. Please try again." };

  await createMemberSession({ sub: String(member.id), email: member.email, name: member.name });
  redirect(member.trainingCompleted ? "/app/home" : "/app/training");
}

export async function registerMember(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const zip = String(formData.get("zip") || "").trim();
  const password = String(formData.get("password") || "");
  const referral = String(formData.get("referral") || "").trim();

  if (!firstName || !email || !password) return { error: "First name, email and password are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists — try signing in." };

  const referredBy = referral ? await prisma.member.findFirst({ where: { membershipCode: referral } }) : null;

  const member = await prisma.member.create({
    data: {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      zip,
      passwordHash: await bcrypt.hash(password, 10),
      membershipCode: membershipCode(),
      isActive: true,
      isApproved: true, // demo: no manual approval step blocks the flow
      trainingCompleted: false, // must pass the safety test first
      referredById: referredBy ? referredBy.id : null,
    },
  });

  await createMemberSession({ sub: String(member.id), email: member.email, name: member.name });
  redirect("/app/training");
}

export async function logoutMember() {
  await destroyMemberSession();
  redirect("/app/signin");
}

export async function completeSafetyTest() {
  const session = await getMemberSession();
  if (!session) redirect("/app/signin");
  await prisma.member.update({ where: { id: Number(session.sub) }, data: { trainingCompleted: true } });
  redirect("/app/home");
}
