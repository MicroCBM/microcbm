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

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
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
