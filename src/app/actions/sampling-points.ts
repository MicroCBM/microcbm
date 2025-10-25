"use server";

import { SamplingPoint } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddSamplingPointPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getSamplingPointsService(): Promise<SamplingPoint[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}sampling-points`, {
      method: "GET",
    });

    const data = await response.json();

    console.log("data", data);

    return data?.data;
  } catch (error) {
    console.error("Error fetching sampling points:", error);
    throw error;
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
    `${commonEndpoint}sampling-point/${id}`,
    payload,
    "PUT"
  );
}

async function deleteSamplingPointService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-point/${id}`,
    {},
    "DELETE"
  );
}

async function getSamplingPointService(id: string): Promise<SamplingPoint> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-point/${id}`,
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
};
