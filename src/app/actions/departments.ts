"use server";

import { Department } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddDepartmentPayload, EditDepartmentPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getDepartmentsService(): Promise<Department[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}departments`, {
      method: "GET",
    });

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access departments");
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
            `Failed to fetch departments: ${response.status} ${response.statusText}`
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
    console.error("Error fetching departments:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function getDepartmentService(id: string): Promise<Department> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}departments/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(`Failed to fetch department: ${response.status} ${response.statusText}`);
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
    console.error("Error fetching department by id:", error);
    throw error;
  }
}

async function addDepartmentService(
  payload: AddDepartmentPayload
): Promise<ApiResponse> {
  // Transform payload to match API format
  const apiPayload = {
    department: {
      name: payload.name,
      description: payload.description,
      organization: {
        id: payload.organization_id,
      },
    },
  };
  return handleApiRequest(`${commonEndpoint}departments`, apiPayload, "POST");
}

async function editDepartmentService(
  id: string,
  payload: EditDepartmentPayload
): Promise<ApiResponse> {
  // Transform payload to match API format
  const apiPayload = {
    department: {
      name: payload.name,
      description: payload.description,
      organization: {
        id: payload.organization_id,
      },
    },
  };
  return handleApiRequest(
    `${commonEndpoint}departments/${id}`,
    apiPayload,
    "PUT"
  );
}

async function deleteDepartmentService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}departments/${id}`, {}, "DELETE");
}

export {
  getDepartmentsService,
  getDepartmentService,
  addDepartmentService,
  editDepartmentService,
  deleteDepartmentService,
};
