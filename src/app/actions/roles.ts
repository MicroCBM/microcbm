"use server";

import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddRolePayload, EditRolePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  created_at: number;
  created_at_datetime: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}
async function getRolesService(): Promise<Role[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}roles`, {
      method: "GET",
    });

    const data = await response.json();

    console.log("data", data);
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

async function getRoleService(id: string): Promise<Role> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}roles/${id}`, {
      method: "GET",
    });

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

async function deleteRoleService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}roles/${id}`, {}, "DELETE");
}

async function getPermissionsService(): Promise<Permission[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}permissions`, {
      method: "GET",
    });

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
}

async function addRolePermissionsToRoleService(
  role_id: string,
  permission_id: string
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}roles/${role_id}/permissions`,
    { permission_id },
    "POST"
  );
}

export {
  getRolesService,
  getRoleService,
  addRoleService,
  editRoleService,
  deleteRoleService,
  getPermissionsService,
  addRolePermissionsToRoleService,
};
