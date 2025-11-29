"use server";

import { SamplingPoint, SamplingPointAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddSamplingPointPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getSamplingPointsService(): Promise<SamplingPoint[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}sampling-points`, {
      method: "GET",
    });

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access sampling points");
      return [];
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(
        `Failed to fetch sampling points: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data?.data || [];
  } catch (error) {
    console.error("Error fetching sampling points:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function getSamplingPointsAnalyticsService(): Promise<SamplingPointAnalytics | null> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-points/analytics`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn(
        "User does not have permission to access sampling points analytics"
      );
      return null;
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      // Try to get error message from response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch sampling points analytics: ${response.status} ${response.statusText}`
        );
      } else {
        throw new Error(
          `Failed to fetch sampling points analytics: ${response.status} ${response.statusText}`
        );
      }
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, returning null");
      return null;
    }

    const data = await response.json();

    return data?.data || null;
  } catch (error) {
    console.error("Error fetching sampling points analytics:", error);
    // Return null instead of throwing to prevent page crashes
    return null;
  }
}

async function addSamplingPointService(
  payload: AddSamplingPointPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sampling-points`, payload, "POST");
}

async function editSamplingPointService(
  id: string,
  payload: AddSamplingPointPayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-points/${id}`,
    payload,
    "PUT"
  );
}

async function deleteSamplingPointService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-points/${id}`,
    {},
    "DELETE"
  );
}

async function getSamplingPointService(id: string): Promise<SamplingPoint> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-points/${id}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching sampling point by id:", error);
    throw error;
  }
}

export {
  getSamplingPointsService,
  addSamplingPointService,
  editSamplingPointService,
  deleteSamplingPointService,
  getSamplingPointService,
  getSamplingPointsAnalyticsService,
};
