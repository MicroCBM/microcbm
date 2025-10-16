"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJWT, isTokenExpired, getTokenExpirationTime } from "./jwt";
import { SessionUser } from "../types/common";

export async function createUserSession(token: string) {
  const cookieStore = await cookies();

  // Decode token to get expiration time
  const tokenExpiration = getTokenExpirationTime(token);
  if (!tokenExpiration) {
    throw new Error("Invalid token format");
  }

  // Set cookie expiration to match token expiration (24 hours)
  const expiresAt = tokenExpiration;

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
  });

  // Also store user data in a separate cookie for easy access
  const userData = decodeJWT(token);
  if (userData) {
    cookieStore.set("userData", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
    });
  }
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  // Check if token is expired
  if (isTokenExpired(token)) {
    await logoutUserSession();
    return null;
  }

  // Get user data from cookie
  const userDataCookie = cookieStore.get("userData")?.value;
  let userData: SessionUser | null = null;

  if (userDataCookie) {
    try {
      userData = JSON.parse(userDataCookie);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  // If user data is not available, decode from token
  if (!userData) {
    userData = decodeJWT(token);
  }

  return {
    token,
    user: userData,
  };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getUserSession();
  return session?.user || null;
}

export async function logoutUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("userData");
  redirect("/auth/login");
}
