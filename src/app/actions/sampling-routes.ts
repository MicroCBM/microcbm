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

    const data = await response.json();

    console.log("data", data);

    return data?.data;
  } catch (error) {
    console.error("Error fetching sampling routes:", error);
    throw error;
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
