"use server";

import { SamplingRoute } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddSamplingRoutePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getSamplingRoutesService(): Promise<SamplingRoute[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}sampling-routes`, {
      method: "GET",
    });

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access sampling routes");
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
            `Failed to fetch sampling routes: ${response.status} ${response.statusText}`
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

    console.log("data", data);

    return data?.data || [];
  } catch (error) {
    console.error("Error fetching sampling routes:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function addSamplingRouteService(
  payload: AddSamplingRoutePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sampling-routes`, payload, "POST");
}

async function editSamplingRouteService(
  id: string,
  payload: AddSamplingRoutePayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-routes/${id}`,
    payload,
    "PUT"
  );
}

async function deleteSamplingRouteService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-routes/${id}`,
    {},
    "DELETE"
  );
}

async function getSamplingRouteService(id: string): Promise<SamplingRoute> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-routes/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(`Failed to fetch sampling route: ${response.status} ${response.statusText}`);
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
    console.error("Error fetching sampling route by id:", error);
    throw error;
  }
}

export {
  getSamplingRoutesService,
  addSamplingRouteService,
  editSamplingRouteService,
  deleteSamplingRouteService,
  getSamplingRouteService,
};
