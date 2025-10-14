"use server";

import { requestWithAuth } from "./helpers";

const commonEndpoint = "/api/v1/";

export async function getRolesService(): Promise<unknown> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}/roles`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to fetch roles: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}
