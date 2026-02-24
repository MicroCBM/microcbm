"use server";

import { Asset, Sites, SitesAnalytics, AssetAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddAssetPayload, AddSitesPayload, EditSitePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

export interface AssetsMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetAssetsResult {
  data: Asset[];
  meta: AssetsMeta;
}

async function getAssetsService(params?: {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | string[] | undefined;
}): Promise<GetAssetsResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", String(params.search));
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (key === "page" || key === "limit" || key === "search") return;
      if (value !== undefined && value !== "")
        searchParams.set(key, Array.isArray(value) ? value[0] : String(value));
    });
    const queryString = searchParams.toString();
    const url = `${commonEndpoint}assets${queryString ? `?${queryString}` : ""}`;

    const response = await requestWithAuth(url, { method: "GET" });

    if (response.status === 403) {
      console.warn("User does not have permission to access assets");
      return { data: [], meta: { page: 1, limit: 10, total: 0, total_pages: 0, has_next: false, has_prev: false } };
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(
        `Failed to fetch assets: ${response.status} ${response.statusText}`,
      );
    }

    const json = await response.json();
    const data = json?.data ?? [];
    const meta = json?.meta ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    };

    return {
      data: Array.isArray(data) ? data : [],
      meta: {
        page: meta.page ?? 1,
        limit: meta.limit ?? 10,
        total: meta.total ?? 0,
        total_pages: meta.total_pages ?? 0,
        has_next: Boolean(meta.has_next),
        has_prev: Boolean(meta.has_prev),
      },
    };
  } catch (error) {
    console.error("Error fetching assets:", error);
    return {
      data: [],
      meta: { page: 1, limit: 10, total: 0, total_pages: 0, has_next: false, has_prev: false },
    };
  }
}

async function addAssetService(payload: AddAssetPayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}assets`, payload, "POST");
}

async function editAssetService(
  id: string,
  payload: AddAssetPayload,
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}assets/${id}`, payload, "PUT");
}

async function deleteAssetService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}assets/${id}`, undefined, "DELETE");
}

async function addSiteService(payload: AddSitesPayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sites`, payload, "POST");
}

async function editSiteService(
  id: string,
  payload: EditSitePayload,
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sites/${id}`, payload, "PUT");
}

async function deleteSiteService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sites/${id}`, {}, "DELETE");
}

export interface SitesMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetSitesResult {
  data: Sites[];
  meta: SitesMeta;
}

function defaultSitesMeta(
  total: number,
  page = 1,
  limit = 10
): SitesMeta {
  const total_pages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    total_pages,
    has_next: page < total_pages,
    has_prev: page > 1,
  };
}

async function getSitesService(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  organization_id?: string;
}): Promise<GetSitesResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.organization_id)
      searchParams.set("organization_id", params.organization_id);
    const query = searchParams.toString();
    const url = `${commonEndpoint}sites${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    if (response.status === 403) {
      console.warn("User does not have permission to access sites");
      return {
        data: [],
        meta: defaultSitesMeta(0, params?.page ?? 1, params?.limit ?? 10),
      };
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return {
        data: [],
        meta: defaultSitesMeta(0, params?.page ?? 1, params?.limit ?? 10),
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.warn("Response is not JSON, returning empty array");
      return {
        data: [],
        meta: defaultSitesMeta(0, params?.page ?? 1, params?.limit ?? 10),
      };
    }

    const json = await response.json();
    const rawData = json?.data ?? [];
    const list = Array.isArray(rawData) ? rawData : [];
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    if (json?.meta) {
      const meta = {
        page: json.meta.page ?? page,
        limit: json.meta.limit ?? limit,
        total: json.meta.total ?? list.length,
        total_pages:
          json.meta.total_pages ??
          Math.max(
            1,
            Math.ceil(
              (json.meta.total ?? list.length) / (json.meta.limit ?? limit)
            )
          ),
        has_next: Boolean(json.meta.has_next),
        has_prev: Boolean(json.meta.has_prev),
      };
      return { data: list, meta };
    }

    const total = list.length;
    const start = (page - 1) * limit;
    const data = list.slice(start, start + limit);
    return { data, meta: defaultSitesMeta(total, page, limit) };
  } catch (error) {
    console.error("Error fetching sites:", error);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { data: [], meta: defaultSitesMeta(0, page, limit) };
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
      },
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
