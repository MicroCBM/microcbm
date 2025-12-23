"use server";

import { Asset, Sites, SitesAnalytics, AssetAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddAssetPayload, AddSitesPayload, EditSitePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getAssetsService(params?: {
  [key: string]: string | string[] | undefined;
}): Promise<Asset[]> {
  try {
    const queryString = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, value] as [string, string])
    ).toString();
    const response = await requestWithAuth(
      `${commonEndpoint}assets?${queryString}`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access assets");
      return [];
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(
        `Failed to fetch assets: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data?.data || [];
  } catch (error) {
    console.error("Error fetching assets:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function addAssetService(payload: AddAssetPayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}assets`, payload, "POST");
}

async function editAssetService(
  id: string,
  payload: AddAssetPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}assets/${id}`, payload, "PUT");
}

async function deleteAssetService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}assets/${id}`, {}, "DELETE");
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

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access sites");
      return [];
    }

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
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

async function getSitesAnalyticsService(): Promise<SitesAnalytics | null> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}sites/analytics`, {
      method: "GET",
    });

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access sites analytics");
      return null;
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Non-JSON response from sites analytics API");
      return null;
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching sites analytics:", error);
    // Return null instead of throwing to prevent page crashes
    return null;
  }
}

async function getAssetsAnalyticsService(): Promise<AssetAnalytics | null> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}assets/analytics`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access assets analytics");
      return null;
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Non-JSON response from assets analytics API");
      return null;
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching assets analytics:", error);
    // Return null instead of throwing to prevent page crashes
    return null;
  }
}

async function getAssetService(id: string): Promise<Asset> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}assets/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching asset by id:", error);
    throw error;
  }
}

async function getSiteService(id: string): Promise<Sites> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}sites/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching site by id:", error);
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
  getAssetService,
  getSiteService,
  editAssetService,
  deleteAssetService,
  getSitesAnalyticsService,
  getAssetsAnalyticsService,
};
