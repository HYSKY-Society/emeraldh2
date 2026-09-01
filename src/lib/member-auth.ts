import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "eh2_member";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "insecure-dev-secret");

export type MemberSession = {
  sub: string; // member id
  email: string;
  name: string;
};

export async function createMemberSession(payload: MemberSession) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyMemberSession() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as MemberSession;
  } catch {
    return null;
  }
}

export const MEMBER_COOKIE = COOKIE;
