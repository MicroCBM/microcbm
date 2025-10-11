"use server";

import { createUserSession, logoutUserSession } from "@/libs";
import { requestWithAuth } from ".";

// Common response interface
interface ApiResponse {
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

const commonEndpoint = "/api/v1/auth";

// Helper function to handle API requests
async function handleApiRequest(
  endpoint: string,
  body: unknown
): Promise<ApiResponse> {
  try {
    const res = await requestWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    const responseText = await res.text();

    // Parse JSON response
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

    // Return response based on status
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

// Helper function to handle errors
function handleError(error: unknown): ApiResponse {
  if (!(error instanceof Error)) {
    return {
      success: false,
      statusCode: 500,
      message: "An unexpected error occurred.",
    };
  }

  // Timeout error
  if (error.name === "AbortError") {
    return {
      success: false,
      statusCode: 408,
      message: "Request timeout. Please try again.",
    };
  }

  // Network errors
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

// Login service
export async function loginService(formData: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/login`, {
    email: formData.email,
    password: formData.password,
  });
}

// Signup service
export async function signupService(formData: {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  organization: {
    name: string;
    industry: string;
    team_strength: string;
    logo_url: string;
  };
  password: string;
}): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/signup`, {
    user: formData.user,
    organization: formData.organization,
    password: formData.password,
  });
}

// OTP verification service
export async function verifyOTPService(formData: {
  email: string;
  otp: string;
}): Promise<ApiResponse> {
  const response = await handleApiRequest(`${commonEndpoint}/verify-otp`, {
    email: formData.email,
    otp: formData.otp,
  });

  console.log("response", response);

  if (response?.success && response.data?.data?.token) {
    await createUserSession(response.data.data.token);
  }

  return response;
}

export async function requestPasswordResetService(
  email: string
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/request-password-reset`, {
    email: email,
  });
}

export async function verifyPasswordResetOTPService(
  email: string,
  otp: string
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/verify-reset-otp`, {
    email: email,
    otp: otp,
  });
}

export async function resetPasswordService(
  password: string,
  confirmPassword: string
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/reset-password`, {
    password: password,
    confirmPassword: confirmPassword,
  });
}

export async function logout() {
  await logoutUserSession();
}
