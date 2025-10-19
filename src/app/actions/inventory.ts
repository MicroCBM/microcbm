"use server";

import { Asset, Sites } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddAssetPayload, AddSitesPayload, EditSitePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getAssetsService(): Promise<Asset[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}assets`, {
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
  return handleApiRequest(`${commonEndpoint}assets`, payload, "POST");
}

async function addSiteService(payload: AddSitesPayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sites`, payload, "POST");
}

async function editSiteService(
  id: string,
  payload: EditSitePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sites/${id}`, payload, "PUT");
}

async function deleteSiteService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sites/${id}`, { method: "DELETE" });
}

async function getSitesService(): Promise<Sites[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}sites`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(
        `Failed to fetch sites: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Sites API Response:", data);

    return data?.data || [];
  } catch (error) {
    console.error("Error fetching sites:", error);
    throw error;
  }
}

export {
  getAssetsService,
  addAssetService,
  getSitesService,
  addSiteService,
  editSiteService,
  deleteSiteService,
};
