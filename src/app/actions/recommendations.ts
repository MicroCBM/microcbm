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

    if (response.status === 403 || !response.ok) {
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return [];
    }

    const data = await response.json();
    return data?.data || [];
  } catch {
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

    if (response.status === 403 || !response.ok) {
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return [];
    }

    const data = await response.json();
    return data?.data || [];
  } catch {
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
