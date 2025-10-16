import { cookies } from "next/headers";

export interface ApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    success?: boolean;
    token?: string;
    access_token?: string;
    message?: string;
    data?: {
      token?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

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
  const url = `${process.env.NEXT_PUBLIC_API_URL}${input}`;

  console.log("Request URL:", url);
  console.log("Has Authorization header:", headers.has("Authorization"));

  return fetch(url, requestInit);
}

export function handleError(error: unknown): ApiResponse {
  if (!(error instanceof Error)) {
    return {
      success: false,
      statusCode: 500,
      message: "An unexpected error occurred.",
    };
  }

  if (error.name === "AbortError") {
    return {
      success: false,
      statusCode: 408,
      message: "Request timeout. Please try again.",
    };
  }

  const errorCode = (error as NodeJS.ErrnoException).code;
  if (errorCode === "ENOTFOUND" || errorCode === "ECONNREFUSED") {
    return {
      success: false,
      statusCode: 503,
      message: "Unable to connect to server. Please try again later.",
    };
  }

  return {
    success: false,
    statusCode: 500,
    message: error.message || "An unexpected error occurred.",
  };
}

export async function handleApiRequest(
  endpoint: string,
  body: unknown,
  method: "POST" | "GET" | "PUT" | "DELETE" = "POST"
): Promise<ApiResponse> {
  try {
    console.log("API Request body:", body);
    console.log(
      "JSON stringified body:",
      body ? JSON.stringify(body) : undefined
    );

    const res = await requestWithAuth(endpoint, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseText = await res.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        statusCode: res.status,
        message: "Invalid response from server.",
      };
    }

    if (res.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        statusCode: res.status,
        message: data.message || "Request failed",
      };
    }
  } catch (error: unknown) {
    return handleError(error);
  }
}
