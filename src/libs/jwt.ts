import { decodeJwt } from "jose";

export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  role_id: string;
  permissions: string[];
  org_id: string;
  exp: number;
  iat: number;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = decodeJwt(token);

    return decoded as unknown as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function getTokenExpirationTime(token: string): Date | null {
  const payload = decodeJWT(token);
  if (!payload) return null;

  return new Date(payload.exp * 1000);
}
