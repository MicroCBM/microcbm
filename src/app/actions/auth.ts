"use server";

import { createUserSession, logoutUserSession } from "@/libs";
import { handleApiRequest, type ApiResponse } from "./helpers";

const commonEndpoint = "/api/v1/auth";

export async function loginService(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/login`, payload);
}

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

export async function verifyOTPService(formData: {
  email: string;
  otp: string;
}): Promise<ApiResponse> {
  const response = await handleApiRequest(`${commonEndpoint}/verify-otp`, {
    email: formData.email,
    otp: formData.otp,
  });

  if (response?.success) {
    const token =
      response.data?.data?.token ||
      response.data?.data?.access_token ||
      response.data?.token ||
      response.data?.access_token;

    if (token && typeof token === "string") {
      await createUserSession(token);
    } else {
      console.error("No token found in response:", response.data);
    }
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

export async function resetPasswordService(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/reset-password`, payload);
}

export async function logout() {
  await logoutUserSession();
}
