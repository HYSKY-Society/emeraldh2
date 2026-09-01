"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Email and password are required." };

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return { error: "Invalid credentials. Please try again." };

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return { error: "Invalid credentials. Please try again." };

  await createSession({ sub: String(admin.id), email: admin.email, name: admin.name });
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
