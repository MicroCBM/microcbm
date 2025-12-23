"use server";

import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import {
  AddPermissionPayload,
  AddRolePayload,
  EditRolePayload,
} from "@/schema";

const commonEndpoint = "/api/v1/";

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  description: string;
  created_at: number;
  created_at_datetime: string;
  active: boolean;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

async function getRolesService(queryParams?: {
  name?: string;
}): Promise<Role[]> {
  try {
    const queryString = queryParams
      ? new URLSearchParams(
          Object.entries(queryParams)
            .filter(([, value]) => value !== undefined && value !== "")
            .map(([key, value]) => [key, value] as [string, string])
        ).toString()
      : "";

    const url = `${commonEndpoint}roles${queryString ? `?${queryString}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access roles");
      return [];
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "Error message:",
          errorData?.message ||
            `Failed to fetch roles: ${response.status} ${response.statusText}`
        );
      }
      // Return empty array instead of throwing to prevent page crashes
      return [];
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, returning empty array");
      return [];
    }

    const data = await response.json();

    return data?.data || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function getSingleRoleService(id: string): Promise<Role> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}roles/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(`Failed to fetch role: ${response.status} ${response.statusText}`);
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON");
      throw new Error("Invalid response from server");
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error fetching single role:", error);
    throw error;
  }
}

async function getUsersByRoleIdService(id: string): Promise<unknown[]> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}users/under-role/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return [];
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, returning empty array");
      return [];
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching users by role id:", error);
    return [];
  }
}

async function getRoleService(id: string): Promise<Role> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}roles/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(`Failed to fetch role: ${response.status} ${response.statusText}`);
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON");
      throw new Error("Invalid response from server");
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error fetching role by id:", error);
    throw error;
  }
}

async function addRoleService(payload: AddRolePayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}roles`, payload, "POST");
}

async function editRoleService(
  id: string,
  payload: EditRolePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}roles/${id}`, payload, "PUT");
}

async function toggleRoleActiveStatusService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}roles/${id}/toggle-active`,
    {},
    "PATCH"
  );
}

async function deleteRoleService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}roles/${id}`, {}, "DELETE");
}

async function getPermissionsByRoleIdService(
  roleId: string
): Promise<Permission[]> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}roles/${roleId}/permissions`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    const responseData = data?.data;

    // Handle case where API returns a role object with permissions property
    if (responseData && typeof responseData === "object") {
      if (
        "permissions" in responseData &&
        Array.isArray(responseData.permissions)
      ) {
        return responseData.permissions;
      }
    }

    // Handle case where API returns permissions array directly
    if (Array.isArray(responseData)) {
      return responseData;
    }

    return [];
  } catch (error) {
    console.error("Error fetching permissions by role id:", error);
    // Return empty array on error instead of throwing to prevent UI crashes
    return [];
  }
}

async function getPermissionsService(): Promise<Permission[]> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}permissions?page=1&limit=100`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access permissions");
      return [];
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "Error message:",
          errorData?.message ||
            `Failed to fetch permissions: ${response.status} ${response.statusText}`
        );
      }
      // Return empty array instead of throwing to prevent page crashes
      return [];
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, returning empty array");
      return [];
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function addPermissionsToRoleService(
  roleId: string,
  permission_id: string[]
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}roles/${roleId}/permissions`,
    { permission_ids: permission_id },
    "POST"
  );
}

async function addPermissionService(
  payload: AddPermissionPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}permissions`, payload, "POST");
}

export {
  getRolesService,
  getRoleService,
  addRoleService,
  editRoleService,
  deleteRoleService,
  getPermissionsService,
  getPermissionsByRoleIdService,
  addPermissionsToRoleService,
  getSingleRoleService,
  toggleRoleActiveStatusService,
  addPermissionService,
  getUsersByRoleIdService,
};
