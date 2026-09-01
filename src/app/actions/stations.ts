"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createStation(formData: FormData) {
  const code = String(formData.get("code") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const address = String(formData.get("address") || "").trim();
  if (!code || !title || !address) return;
  await prisma.station.create({
    data: {
      code,
      title,
      address,
      pricePerKg: Number(formData.get("pricePerKg") || 15),
      capacityKg: Number(formData.get("capacityKg") || 10),
      status: String(formData.get("status") || "active"),
      description: String(formData.get("description") || ""),
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    },
  });
  revalidatePath("/admin/stations");
  redirect("/admin/stations");
}

export async function updateStationStatus(id: number, status: string) {
  await prisma.station.update({ where: { id }, data: { status } });
  revalidatePath("/admin/stations");
  revalidatePath("/admin/stations/dashboard");
  revalidatePath(`/admin/stations/${id}`);
}

export async function deleteStation(id: number) {
  const bookings = await prisma.booking.count({ where: { stationId: id } });
  if (bookings === 0) {
    await prisma.station.delete({ where: { id } });
  } else {
    // keep referential integrity: mark offline instead of deleting a station with history
    await prisma.station.update({ where: { id }, data: { status: "offline" } });
  }
  revalidatePath("/admin/stations");
  redirect("/admin/stations");
}
