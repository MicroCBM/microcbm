"use server";

import { Organization } from "@/types";
import { requestWithAuth } from "./helpers";

const commonEndpoint = "/api/v1/organizations";

export async function getAllOrganizationsService(): Promise<Organization[]> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}`, {
      method: "GET",
    });

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error getting all organizations:", error);
    throw error;
  }
}
