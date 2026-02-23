"use server";

import { Alarm, AlarmAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddAlarmPayload, EditAlarmPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

export interface AlarmsMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetAlarmsResult {
  data: Alarm[];
  meta: AlarmsMeta;
}

function defaultAlarmsMeta(
  total: number,
  page = 1,
  limit = 10
): AlarmsMeta {
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

async function getAlarmsService(params?: {
  page?: number;
  limit?: number;
  site_id?: string;
  severity?: string;
}): Promise<GetAlarmsResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.site_id) searchParams.set("site_id", params.site_id);
    if (params?.severity) searchParams.set("severity", params.severity);
    const query = searchParams.toString();
    const url = `${commonEndpoint}alarms${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;
      return { data: [], meta: defaultAlarmsMeta(0, page, limit) };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;
      return { data: [], meta: defaultAlarmsMeta(0, page, limit) };
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
    return { data, meta: defaultAlarmsMeta(total, page, limit) };
  } catch (error) {
    console.error("Error fetching alarms:", error);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { data: [], meta: defaultAlarmsMeta(0, page, limit) };
  }
}

async function getAlarmsAnalyticsService(): Promise<AlarmAnalytics | null> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}alarms/analytics`,
      {
        method: "GET",
      }
    );

    // Handle 403 Forbidden (permission denied) gracefully
    if (response.status === 403) {
      console.warn("User does not have permission to access alarms analytics");
      return null;
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Non-JSON response from alarms analytics API");
      return null;
    }

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching alarms analytics:", error);
    // Return null instead of throwing to prevent page crashes
    return null;
  }
}

async function getAlarmService(id: string): Promise<Alarm> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}alarms/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching alarm by id:", error);
    throw error;
  }
}

async function addAlarmService(payload: AddAlarmPayload): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}alarms`, payload, "POST");
}

async function editAlarmService(
  id: string,
  payload: EditAlarmPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}alarms/${id}`, payload, "PUT");
}

async function deleteAlarmService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}alarms/${id}`, {}, "DELETE");
}

export {
  getAlarmsService,
  getAlarmsAnalyticsService,
  getAlarmService,
  addAlarmService,
  editAlarmService,
  deleteAlarmService,
};
