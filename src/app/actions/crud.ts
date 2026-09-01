"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || `item-${Date.now()}`;
}

/* ---------------- Safety questions ---------------- */
export async function createQuestion(formData: FormData) {
  const text = String(formData.get("text") || "").trim();
  if (!text) return;
  await prisma.question.create({ data: { text, status: String(formData.get("status") || "active") } });
  revalidatePath("/admin/questions");
  redirect("/admin/questions");
}
export async function toggleQuestion(id: number, status: string) {
  await prisma.question.update({ where: { id }, data: { status } });
  revalidatePath("/admin/questions");
}
export async function deleteQuestion(id: number) {
  await prisma.question.delete({ where: { id } });
  revalidatePath("/admin/questions");
}

/* ---------------- Content ---------------- */
export async function createContent(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await prisma.content.create({
    data: { title, slug: slugify(title), body: String(formData.get("body") || ""), status: String(formData.get("status") || "published") },
  });
  revalidatePath("/admin/content");
  redirect("/admin/content");
}
export async function deleteContent(id: number) {
  await prisma.content.delete({ where: { id } });
  revalidatePath("/admin/content");
}

/* ---------------- News & media ---------------- */
export async function createNews(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await prisma.newsMedia.create({
    data: {
      title,
      slug: slugify(title),
      excerpt: String(formData.get("excerpt") || ""),
      body: String(formData.get("body") || ""),
      type: String(formData.get("type") || "news"),
      status: String(formData.get("status") || "published"),
    },
  });
  revalidatePath("/admin/news");
  redirect("/admin/news");
}
export async function deleteNews(id: number) {
  await prisma.newsMedia.delete({ where: { id } });
  revalidatePath("/admin/news");
}

/* ---------------- Donations ---------------- */
export async function createDonation(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  if (!name || !amount) return;
  await prisma.donation.create({ data: { name, email: String(formData.get("email") || ""), amount, message: String(formData.get("message") || "") } });
  revalidatePath("/admin/donations");
}
export async function deleteDonation(id: number) {
  await prisma.donation.delete({ where: { id } });
  revalidatePath("/admin/donations");
}

/* ---------------- Forum categories ---------------- */
export async function createForumCategory(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  await prisma.forumCategory.create({ data: { name, description: String(formData.get("description") || ""), status: "active" } });
  revalidatePath("/admin/forum");
}
export async function deleteForumCategory(id: number) {
  await prisma.forumCategory.delete({ where: { id } });
  revalidatePath("/admin/forum");
}

/* ---------------- Web training ---------------- */
export async function createWebTraining(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await prisma.webTraining.create({ data: { title, body: String(formData.get("body") || ""), videoUrl: String(formData.get("videoUrl") || "") } });
  revalidatePath("/admin/web-training");
}
export async function deleteWebTraining(id: number) {
  await prisma.webTraining.delete({ where: { id } });
  revalidatePath("/admin/web-training");
}

/* ---------------- App training screens ---------------- */
export async function createTrainingScreen(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  await prisma.trainingScreen.create({ data: { title, body: String(formData.get("body") || ""), sortOrder: Number(formData.get("sortOrder") || 0) } });
  revalidatePath("/admin/app-training");
}
export async function deleteTrainingScreen(id: number) {
  await prisma.trainingScreen.delete({ where: { id } });
  revalidatePath("/admin/app-training");
}

/* ---------------- Lead funnels ---------------- */
export async function deleteFractional(id: number) {
  await prisma.fractionalSignup.delete({ where: { id } });
  revalidatePath("/admin/fractional");
}
export async function deleteCarInterest(id: number) {
  await prisma.carInterest.delete({ where: { id } });
  revalidatePath("/admin/car-waitlist");
}
export async function deleteCarApplication(id: number) {
  await prisma.carApplication.delete({ where: { id } });
  revalidatePath("/admin/car-applications");
}

/* ---------------- Mail ---------------- */
export async function createMailTemplate(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  await prisma.mailTemplate.create({ data: { name, subject: String(formData.get("subject") || ""), body: String(formData.get("body") || "") } });
  revalidatePath("/admin/mail/templates");
  redirect("/admin/mail/templates");
}
export async function deleteMailTemplate(id: number) {
  await prisma.mailTemplate.delete({ where: { id } });
  revalidatePath("/admin/mail/templates");
}
export async function sendBulkMail(formData: FormData) {
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "");
  const segment = String(formData.get("segment") || "all");
  if (!subject) return;
  const where = segment === "approved" ? { isApproved: true } : segment === "pending" ? { isApproved: false } : {};
  const recipients = await prisma.member.count({ where });
  // NOTE: real delivery would call an SMTP provider here using Setting's mail config.
  await prisma.sentMail.create({ data: { subject, body, segment, recipients } });
  revalidatePath("/admin/mail");
}

/* ---------------- Settings ---------------- */
export async function saveSettings(formData: FormData) {
  await prisma.setting.update({
    where: { id: 1 },
    data: {
      companyName: String(formData.get("companyName") || "Emerald H2"),
      copyright: String(formData.get("copyright") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      contactPhone: String(formData.get("contactPhone") || ""),
      contactAddress: String(formData.get("contactAddress") || ""),
      androidUrl: String(formData.get("androidUrl") || ""),
      iosUrl: String(formData.get("iosUrl") || ""),
    },
  });
  revalidatePath("/admin/settings");
}
export async function saveHomepage(formData: FormData) {
  await prisma.setting.update({
    where: { id: 1 },
    data: {
      heroTitle: String(formData.get("heroTitle") || ""),
      heroSubtitle: String(formData.get("heroSubtitle") || ""),
      heroTagline: String(formData.get("heroTagline") || ""),
    },
  });
  revalidatePath("/admin/homepage");
}
export async function saveMailSettings(formData: FormData) {
  await prisma.setting.update({
    where: { id: 1 },
    data: {
      smtpHost: String(formData.get("smtpHost") || ""),
      smtpPort: formData.get("smtpPort") ? Number(formData.get("smtpPort")) : null,
      smtpUser: String(formData.get("smtpUser") || ""),
      smtpPassword: String(formData.get("smtpPassword") || ""),
      fromEmail: String(formData.get("fromEmail") || ""),
      fromName: String(formData.get("fromName") || ""),
    },
  });
  revalidatePath("/admin/settings/mail");
}
