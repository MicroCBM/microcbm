"use server";

import { Department } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddDepartmentPayload, EditDepartmentPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

export interface DepartmentsMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetDepartmentsResult {
  data: Department[];
  meta: DepartmentsMeta;
}

function defaultMeta(
  total: number,
  page = 1,
  limit = 10
): DepartmentsMeta {
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

async function getDepartmentsService(params?: {
  page?: number;
  limit?: number;
}): Promise<GetDepartmentsResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString();
    const url = `${commonEndpoint}departments${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    if (response.status === 403) {
      console.warn("User does not have permission to access departments");
      return {
        data: [],
        meta: defaultMeta(0, params?.page ?? 1, params?.limit ?? 10),
      };
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "Error message:",
          errorData?.message ||
            `Failed to fetch departments: ${response.status} ${response.statusText}`,
        );
      }
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
    console.error("Error fetching departments:", error);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { data: [], meta: defaultMeta(0, page, limit) };
  }
}

async function getDepartmentService(id: string): Promise<Department> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}departments/${id}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error(
        `Failed to fetch department: ${response.status} ${response.statusText}`,
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
    console.error("Error fetching department by id:", error);
    throw error;
  }
}

async function addDepartmentService(
  payload: AddDepartmentPayload,
): Promise<ApiResponse> {
  // Transform payload to match API format
  const apiPayload = {
    department: {
      name: payload.name,
      description: payload.description,
      organization: {
        id: payload.organization_id,
      },
    },
  };
  return handleApiRequest(`${commonEndpoint}departments`, apiPayload, "POST");
}

async function editDepartmentService(
  id: string,
  payload: EditDepartmentPayload,
): Promise<ApiResponse> {
  // Transform payload to match API format
  const apiPayload = {
    department: {
      name: payload.name,
      description: payload.description,
      organization: {
        id: payload.organization_id,
      },
    },
  };
  return handleApiRequest(
    `${commonEndpoint}departments/${id}`,
    apiPayload,
    "PUT",
  );
}

async function deleteDepartmentService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}departments/${id}`, {}, "DELETE");
}

export {
  getDepartmentsService,
  getDepartmentService,
  addDepartmentService,
  editDepartmentService,
  deleteDepartmentService,
};
