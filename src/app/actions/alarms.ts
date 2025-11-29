"use server";

import { Alarm, AlarmAnalytics } from "@/types";
import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import { AddAlarmPayload, EditAlarmPayload } from "@/schema";

const commonEndpoint = "/api/v1/";

async function getAlarmsService(): Promise<Alarm[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}alarms`, {
      method: "GET",
    });

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching alarms:", error);
    throw error;
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
