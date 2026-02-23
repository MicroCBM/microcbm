"use server";

import { SamplingRoute } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddSamplingRoutePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

export interface SamplingRoutesMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetSamplingRoutesResult {
  data: SamplingRoute[];
  meta: SamplingRoutesMeta;
}

function defaultMeta(total: number, page = 1, limit = 10): SamplingRoutesMeta {
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

async function getSamplingRoutesService(params?: {
  page?: number;
  limit?: number;
}): Promise<GetSamplingRoutesResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString();
    const url = `${commonEndpoint}sampling-routes${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access sampling routes");
      return { data: [], meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10) };
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "Error message:",
          errorData?.message ||
            `Failed to fetch sampling routes: ${response.status} ${response.statusText}`,
        );
      }
      return { data: [], meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10) };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.warn("Response is not JSON, returning empty array");
      return { data: [], meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10) };
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
            Math.ceil((json.meta.total ?? list.length) / (json.meta.limit ?? limit))
          ),
        has_next: Boolean(json.meta.has_next),
        has_prev: Boolean(json.meta.has_prev),
      };
      return { data: list, meta };
    }

    // API did not return meta: treat as full list and slice client-side
    const total = list.length;
    const start = (page - 1) * limit;
    const data = list.slice(start, start + limit);
    return { data, meta: defaultMeta(total, page, limit) };
  } catch (error) {
    console.error("Error fetching sampling routes:", error);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { data: [], meta: defaultMeta(0, page, limit) };
  }
}

async function addSamplingRouteService(
  payload: AddSamplingRoutePayload,
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sampling-routes`, payload, "POST");
}

async function editSamplingRouteService(
  id: string,
  payload: AddSamplingRoutePayload,
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-routes/${id}`,
    payload,
    "PUT",
  );
}

async function deleteSamplingRouteService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-routes/${id}`,
    {},
    "DELETE",
  );
}

async function getSamplingRouteService(id: string): Promise<SamplingRoute> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-routes/${id}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(
        `Failed to fetch sampling route: ${response.status} ${response.statusText}`,
      );
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON");
      throw new Error("Invalid response from server");
    }

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
