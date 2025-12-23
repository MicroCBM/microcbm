"use server";

import { Recommendation, RecommendationAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddRecommendationPayload, EditRecommendationPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getRecommendationsService(params: {
  [key: string]: string | string[] | undefined;
}): Promise<Recommendation[]> {
  try {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, value] as [string, string])
    ).toString();
    const response = await requestWithAuth(
      `${commonEndpoint}recommendations?${queryString}`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access recommendations");
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
            `Failed to fetch recommendations: ${response.status} ${response.statusText}`
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
    console.error("Error fetching recommendations:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function getRecommendationAnalyticsService(): Promise<
  RecommendationAnalytics[]
> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}recommendations/analytics`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn(
        "User does not have permission to access recommendation analytics"
      );
      return [];
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch recommendation analytics: ${response.status} ${response.statusText}`
        );
      } else {
        throw new Error(
          `Failed to fetch recommendation analytics: ${response.status} ${response.statusText}`
        );
      }
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
    console.error("Error fetching recommendation analytics:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function getRecommendationService(id: string): Promise<Recommendation> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}recommendations/${id}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching recommendation by id:", error);
    throw error;
  }
}

async function addRecommendationService(
  payload: AddRecommendationPayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}recommendations`,
    { recommendation: payload },
    "POST"
  );
}

async function editRecommendationService(
  id: string,
  payload: EditRecommendationPayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}recommendations/${id}`,
    { recommendation: payload },
    "PUT"
  );
}

async function deleteRecommendationService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}recommendations/${id}`,
    {},
    "DELETE"
  );
}

export {
  getRecommendationsService,
  getRecommendationService,
  addRecommendationService,
  editRecommendationService,
  deleteRecommendationService,
  getRecommendationAnalyticsService,
};
