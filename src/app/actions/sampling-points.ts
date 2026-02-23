"use server";

import { SamplingPoint, SamplingPointAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddSamplingPointPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

export interface SamplingPointsMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetSamplingPointsResult {
  data: SamplingPoint[];
  meta: SamplingPointsMeta;
}

function defaultMeta(
  total: number,
  page = 1,
  limit = 10
): SamplingPointsMeta {
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

async function getSamplingPointsService(params?: {
  page?: number;
  limit?: number;
}): Promise<GetSamplingPointsResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString();
    const url = `${commonEndpoint}sampling-points${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    if (response.status === 403) {
      console.warn("User does not have permission to access sampling points");
      return {
        data: [],
        meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10),
      };
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return {
        data: [],
        meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10),
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.warn("Response is not JSON, returning empty array");
      return {
        data: [],
        meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10),
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
    return { data, meta: defaultMeta(total, page, limit) };
  } catch (error) {
    console.error("Error fetching sampling points:", error);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { data: [], meta: defaultMeta(0, page, limit) };
  }
}

async function getSamplingPointsAnalyticsService(): Promise<SamplingPointAnalytics | null> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-points/analytics`,
      {
        method: "GET",
      },
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn(
        "User does not have permission to access sampling points analytics",
      );
      return null;
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      // Try to get error message from response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch sampling points analytics: ${response.status} ${response.statusText}`,
        );
      } else {
        throw new Error(
          `Failed to fetch sampling points analytics: ${response.status} ${response.statusText}`,
        );
      }
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, returning null");
      return null;
    }

    const data = await response.json();

    return data?.data || null;
  } catch (error) {
    console.error("Error fetching sampling points analytics:", error);
    // Return null instead of throwing to prevent page crashes
    return null;
  }
}

async function addSamplingPointService(
  payload: AddSamplingPointPayload,
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}sampling-points`, payload, "POST");
}

async function editSamplingPointService(
  id: string,
  payload: AddSamplingPointPayload,
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-points/${id}`,
    payload,
    "PUT",
  );
}

async function deleteSamplingPointService(id: string): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}sampling-points/${id}`,
    {},
    "DELETE",
  );
}

async function getSamplingPointService(id: string): Promise<SamplingPoint> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}sampling-points/${id}`,
      {
        method: "GET",
      },
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
  getSamplingPointsAnalyticsService,
};
