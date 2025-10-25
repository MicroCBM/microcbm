"use server";

import { Recommendation } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddRecommendationPayload, EditRecommendationPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getRecommendationsService(): Promise<Recommendation[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}recommendations`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
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
    `${commonEndpoint}recommendation`,
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
};
