import "server-only";
import webpush from "web-push";
import { prisma } from "@/lib/db";

let configured = false;
function configure() {
  if (configured) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:info@emeraldh2.com";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export type PushPayload = { title: string; body: string; url?: string };

/** Send a web-push notification to all of a member's subscribed devices. */
export async function sendPushToMember(memberId: number, payload: PushPayload) {
  if (!configure()) return;
  const subs = await prisma.pushSubscription.findMany({ where: { memberId } });
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload)
        );
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode;
        if (code === 404 || code === 410) {
          // subscription expired — clean it up
          await prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
        }
      }
    })
  );
}
