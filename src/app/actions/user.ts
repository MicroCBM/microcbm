"use server";

import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/utils";

export interface USER_TYPE extends Record<string, unknown> {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  organization: {
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    industry: string;
    logo_url: string;
    members: unknown;
    name: string;
    owner: unknown;
    sites: unknown;
    team_strength: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  password_hash: string;
  phone: string;
  role: string;
  role_id: string | null;
  role_obj: unknown;
  site: {
    address: string;
    attachments: null;
    city: string;
    country: string;
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    installation_environment: string;
    manager_email: string;
    manager_location: string;
    manager_name: string;
    manager_phone_number: string;
    members: unknown;
    name: string;
    organization: unknown;
    regulations_and_standards: unknown;
    tag: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  status: string;
  updated_at: number;
  updated_at_datetime: string;
}

interface EditUserPayload {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    country: string;
    date_of_birth: string;
    role_id: string;
    organization: {
      id: string;
    };
    site: {
      id: string;
    };
  };
}

interface AddUserPayload {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    country: string;
    date_of_birth: string;
    role_id: string;
    organization: {
      id: string;
    };
    site: {
      id: string;
    };
  };
  password: string;
}

const commonEndpoint = "/api/v1/users";

export async function getUsersService(): Promise<USER_TYPE[]> {
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

    // Handle 403 Forbidden (permission denied) gracefully so pages that need users for dropdowns still load
    if (response.status === 403) {
      console.warn("User does not have permission to access users");
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    return data?.data ?? [];
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

export async function editUserService(
  id: string,
  payload: EditUserPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/${id}`, payload, "PUT");
}

export async function viewUserService(id: string): Promise<USER_TYPE> {
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

export async function getUserByIdService(id: string): Promise<USER_TYPE> {
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

export async function activateUserService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/${id}/activate`, {}, "PUT");
}

export async function deleteUserService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/${id}`, {}, "DELETE");
}
