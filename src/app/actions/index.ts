import { cookies } from "next/headers";
// import config from "../../config";
export async function requestWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const token = (await cookies()).get("token")?.value;
  const headers = new Headers(init?.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const requestInit: RequestInit = { ...init, headers };
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, requestInit);
}
// export async function handleApi<T>(
//   input: RequestInfo,
//   init?: RequestInit
// ): Promise<T> {
//   const res = await requestWithAuth(input, init);
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error(data.message || "An unexpected error occurred");
//   }
//   return data;
// }
