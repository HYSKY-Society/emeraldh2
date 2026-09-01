"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function code6() {
  // simple non-random-ish generator based on timestamp is unavailable (Date.now ok at runtime here)
  return String(100000 + Math.floor(Date.now() % 900000));
}

export async function approveMember(id: number) {
  await prisma.member.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/admin/users/approval");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
}

export async function toggleMemberActive(id: number, active: boolean) {
  await prisma.member.update({ where: { id }, data: { isActive: active } });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
}

export async function deleteMember(id: number) {
  await prisma.booking.deleteMany({ where: { memberId: id } });
  await prisma.member.delete({ where: { id } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function createMember(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!name || !email) return;
  await prisma.member.create({
    data: {
      name,
      email,
      phone: String(formData.get("phone") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      zip: String(formData.get("zip") || ""),
      addressLine: String(formData.get("addressLine") || ""),
      membershipCode: code6(),
      isApproved: formData.get("isApproved") === "on",
      isActive: true,
    },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}
