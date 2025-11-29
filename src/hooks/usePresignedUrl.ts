"use client";

import { useEffect, useState } from "react";

interface PresignedUrlState {
  url: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePresignedUrl(
  fileKey?: string | null,
  shouldFetch: boolean = true
): PresignedUrlState {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrl = async () => {
    if (!fileKey || !shouldFetch) {
      setUrl(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/files/presigned?fileKey=${encodeURIComponent(fileKey)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch file URL");
      }

      const data = await response.json();
      setUrl(data?.data?.presigned_url ?? null);
    } catch (err) {
      console.error("Error fetching presigned URL:", err);
      setError("Unable to load file");
      setUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileKey, shouldFetch]);

  return { url, isLoading, error, refetch: fetchUrl };
}
