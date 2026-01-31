"use server";

import { Sample } from "@/types";
import {
  ApiResponse,
  handleApiRequest,
  requestWithAuth,
  handleError,
} from "./helpers";
import { AddSamplePayload, EditSamplePayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getSamplesService(): Promise<Sample[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}samples`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching samples:", error);
    throw error;
  }
}

async function getSampleService(id: string): Promise<Sample> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}samples/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching sample by id:", error);
    throw error;
  }
}

async function addSampleService(
  payload: AddSamplePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}samples`, payload, "POST");
}

async function editSampleService(
  id: string,
  payload: EditSamplePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}samples/${id}`, payload, "PUT");
}

async function deleteSampleService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}samples/${id}`, {}, "DELETE");
}

async function getSampleAnalysisGroupsAnalyticsService(
  category: string,
  period?: number
): Promise<ApiResponse> {
  try {
    const periodParam = period ? `&period=${period}` : "";
    const response = await requestWithAuth(
      `${commonEndpoint}samples/analysis-groups/analytics?category=${category}${periodParam}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching analysis groups analytics:", error);
    return handleError(error);
  }
}

export interface SampleHistoryMeta {
  has_next: boolean;
  has_prev: boolean;
  limit: number;
  page: number;
  total: number;
  total_pages: number;
}

export interface SampleHistoryResponse {
  success: boolean;
  message?: string;
  data: Sample[];
  meta: SampleHistoryMeta;
}

async function getSamplingPointSampleHistoryService(
  samplingPointId: string,
  params: {
    page?: number;
    org_id?: string;
    site_id?: string;
    asset_id?: string;
    limit?: number;
    start_date?: string;
    end_date?: string;
  } = {}
): Promise<SampleHistoryResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params.page != null) searchParams.set("page", String(params.page));
    if (params.org_id) searchParams.set("org_id", params.org_id);
    if (params.site_id) searchParams.set("site_id", params.site_id);
    if (params.asset_id) searchParams.set("asset_id", params.asset_id);
    if (params.limit != null) searchParams.set("limit", String(params.limit));
    if (params.start_date) searchParams.set("start_date", params.start_date);
    if (params.end_date) searchParams.set("end_date", params.end_date);
    const query = searchParams.toString();
    const url = `${commonEndpoint}sampling-points/${samplingPointId}/samples/history${query ? `?${query}` : ""}`;
    const response = await requestWithAuth(url, { method: "GET" });
    const json = await response.json();
    if (!response.ok) {
      return {
        success: false,
        data: [],
        meta: {
          has_next: false,
          has_prev: false,
          limit: params.limit ?? 10,
          page: params.page ?? 1,
          total: 0,
          total_pages: 0,
        },
      };
    }
    return {
      success: true,
      data: json?.data ?? [],
      meta: json?.meta ?? {
        has_next: false,
        has_prev: false,
        limit: params.limit ?? 10,
        page: params.page ?? 1,
        total: 0,
        total_pages: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching sample history:", error);
    return {
      success: false,
      data: [],
      meta: {
        has_next: false,
        has_prev: false,
        limit: params.limit ?? 10,
        page: params.page ?? 1,
        total: 0,
        total_pages: 0,
      },
    };
  }
}

export {
  getSamplesService,
  getSampleService,
  addSampleService,
  editSampleService,
  deleteSampleService,
  getSampleAnalysisGroupsAnalyticsService,
  getSamplingPointSampleHistoryService,
};
