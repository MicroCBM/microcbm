"use server";

import { AddUserPayload, User } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/utils";

const commonEndpoint = "/api/v1/users";

export async function getUsersService(): Promise<User[]> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      redirect(ROUTES.AUTH.LOGIN);
    }

    const response = await requestWithAuth(`${commonEndpoint}`, {
      method: "GET",
    });

    if (response.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete("token");
      redirect(ROUTES.AUTH.LOGIN);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function addUserService(
  payload: AddUserPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}`, payload, "POST");
}

export async function viewUserService(id: string): Promise<User> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to view user: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error viewing user:", error);
    throw error;
  }
}

export async function getUserByIdService(id: string): Promise<User> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to get user by id: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error getting user by id:", error);
    throw error;
  }
}
