"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createUserSession(token: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
  });
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return {
    token,
  };
}

export async function logoutUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/auth/login");
}
