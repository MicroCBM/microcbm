import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrlService } from "@/app/actions/image-upload";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileKey = searchParams.get("fileKey");

    if (!fileKey) {
      return NextResponse.json(
        { error: "fileKey parameter is required" },
        { status: 400 }
      );
    }

    const presignedUrl = await getPresignedUrlService(fileKey);

    return NextResponse.json({
      success: true,
      data: presignedUrl,
    });
  } catch (error) {
    console.error("Presigned URL API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch presigned URL" },
      { status: 500 }
    );
  }
}

