"use server";

import { Organization } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddOrganizationPayload, EditOrganizationPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

export interface OrganizationsMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetOrganizationsResult {
  data: Organization[];
  meta: OrganizationsMeta;
}

function defaultMeta(
  total: number,
  page = 1,
  limit = 10
): OrganizationsMeta {
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

async function getOrganizationsService(params?: {
  page?: number;
  limit?: number;
}): Promise<GetOrganizationsResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString();
    const url = `${commonEndpoint}organizations${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    if (response.status === 403) {
      console.warn("User does not have permission to access organizations");
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
    console.error("Error fetching organizations:", error);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { data: [], meta: defaultMeta(0, page, limit) };
  }
}

async function getOrganizationService(id: string): Promise<Organization> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}organizations/${id}`,
      {
        method: "GET",
      },
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching organization by id:", error);
    throw error;
  }
}

async function addOrganizationService(
  payload: AddOrganizationPayload,
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}organizations`, payload, "POST");
}

async function editOrganizationService(
  id: string,
  payload: EditOrganizationPayload,
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}organizations/${id}`,
    payload,
    "PUT",
  );
}

async function deleteOrganizationService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}organizations/${id}`, {}, "DELETE");
}

export {
  getOrganizationsService,
  getOrganizationService,
  addOrganizationService,
  editOrganizationService,
  deleteOrganizationService,
};
