"use server";

import { Asset } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddAssetPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getAssetsService(): Promise<Asset[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}/assets`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
}

async function addAssetService(payload: AddAssetPayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}/assets`, payload, "POST");
}

export { getAssetsService, addAssetService };
