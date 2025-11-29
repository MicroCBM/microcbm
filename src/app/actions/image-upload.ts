"use server";
import { ApiResponse, requestWithAuth } from "./helpers";
import { cookies } from "next/headers";

const commonEndpoint = "/api/v1/";

interface UploadImagePayload {
  file: File;
}

interface PresignedUrlResponse {
  presigned_url: string;
}

interface DirectDownloadUrlResponse {
  direct_download_url: string;
}

async function uploadImage(
  payload: UploadImagePayload,
  folder: string
): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("folder", folder);

    // Get token from cookies
    const token = (await cookies()).get("token")?.value;

    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${commonEndpoint}files/upload`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        statusCode: res.status,
        message: "Invalid response from server.",
      };
    }

    if (res.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        statusCode: res.status,
        message: data.message || "Upload failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: (error as Error).message || "An unexpected error occurred.",
    };
  }
}

async function getPresignedUrlService(
  fileKey: string
): Promise<PresignedUrlResponse> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}files/download/${fileKey}?presigned=true`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching presigned url:", error);
    throw error;
  }
}

async function getDirectDownloadUrlService(
  fileKey: string
): Promise<DirectDownloadUrlResponse> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}files/download/${fileKey}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Error fetching direct download url:", error);
    throw error;
  }
}

async function deleteFile(fileKey: string): Promise<ApiResponse> {
  try {
    const response = await requestWithAuth(
      `${commonEndpoint}files/${fileKey}`,
      {
        method: "DELETE",
      }
    );

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        statusCode: response.status,
        message: "Invalid response from server.",
      };
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        statusCode: response.status,
        message: data.message || "Delete failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: (error as Error).message || "An unexpected error occurred.",
    };
  }
}

export {
  uploadImage,
  getPresignedUrlService,
  getDirectDownloadUrlService,
  deleteFile,
};
