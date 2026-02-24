"use client";

import React, { useCallback } from "react";
import { DebouncedSearch } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";

export function SamplingPointFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const updateUrl = useCallback(
    (updates: { search?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      const q = params.toString();
      router.push(`/sampling-points${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <DebouncedSearch
          value={search}
          onChange={(value) => updateUrl({ search: value })}
          debounceTime={400}
          placeholder="Search by name, tag, asset name, or sampling route"
          className="h-10 max-w-[296px]"
        />
      </div>
    </div>
  );
}
