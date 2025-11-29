"use server";

import { Sample } from "@/types";
import {
  ApiResponse,
  handleApiRequest,
  requestWithAuth,
  handleError,
} from "./helpers";
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

async function getSampleContaminantsAnalyticsService(
  period: number
): Promise<ApiResponse> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}samples/contaminants/analytics?period=${period}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching contaminants analytics:", error);
    return handleError(error);
  }
}

async function getSampleAnalysisGroupsAnalyticsService(
  category: string,
  period?: number
): Promise<ApiResponse> {
  try {
    const periodParam = period ? `&period=${period}` : "";
    const response = await requestWithAuth(
      `${commonEndpoint}samples/analysis-groups/analytics?category=${category}${periodParam}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching analysis groups analytics:", error);
    return handleError(error);
  }
}

export {
  getSamplesService,
  getSampleService,
  addSampleService,
  editSampleService,
  deleteSampleService,
  getSampleContaminantsAnalyticsService,
  getSampleAnalysisGroupsAnalyticsService,
};
