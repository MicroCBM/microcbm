"use server";

import { Sample } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddSamplePayload, EditSamplePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getSamplesService(): Promise<Sample[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}samples`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching samples:", error);
    throw error;
  }
}

async function getSampleService(id: string): Promise<Sample> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}samples/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching sample by id:", error);
    throw error;
  }
}

async function addSampleService(
  payload: AddSamplePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}samples`, payload, "POST");
}

async function editSampleService(
  id: string,
  payload: EditSamplePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}samples/${id}`, payload, "PUT");
}

async function deleteSampleService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}samples/${id}`, {}, "DELETE");
}

export {
  getSamplesService,
  getSampleService,
  addSampleService,
  editSampleService,
  deleteSampleService,
};
