"use server";

import { Organization } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddOrganizationPayload, EditOrganizationPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getOrganizationsService(): Promise<Organization[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}organizations`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

async function getOrganizationService(id: string): Promise<Organization> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}organizations/${id}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching organization by id:", error);
    throw error;
  }
}

async function addOrganizationService(
  payload: AddOrganizationPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}organizations`, payload, "POST");
}

async function editOrganizationService(
  id: string,
  payload: EditOrganizationPayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}organizations/${id}`,
    payload,
    "PUT"
  );
}

async function deleteOrganizationService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}organizations/${id}`, {}, "DELETE");
}

export {
  getOrganizationsService,
  getOrganizationService,
  addOrganizationService,
  editOrganizationService,
  deleteOrganizationService,
};
