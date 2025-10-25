"use server";

import { Alarm } from "@/types";
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
  getAlarmService,
  addAlarmService,
  editAlarmService,
  deleteAlarmService,
};
