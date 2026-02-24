"use client";

import React, { useCallback } from "react";
import { Button, DebouncedSearch } from "@/components";
import { Icon } from "@/libs";
import { useRouter, useSearchParams } from "next/navigation";
import { Asset, SamplingPoint, Sites } from "@/types";
import { Dropdown } from "@/components/dropdown";

interface SampleFiltersProps {
  sites?: Sites[];
  assets?: Asset[];
  samplingPoints?: SamplingPoint[];
}

export function SampleFilters({
  sites = [],
  assets = [],
  samplingPoints = [],
}: SampleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const site_id = searchParams.get("site_id") ?? "";
  const asset_id = searchParams.get("asset_id") ?? "";
  const sampling_point_id =
    searchParams.get("sampling_point_id") ?? "";
  // const lab_name = searchParams.get("lab_name") ?? "";

  const updateUrl = useCallback(
    (updates: {
      search?: string;
      site_id?: string;
      asset_id?: string;
      sampling_point_id?: string;
      lab_name?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      if (updates.site_id !== undefined) {
        if (updates.site_id) params.set("site_id", updates.site_id);
        else params.delete("site_id");
      }
      if (updates.asset_id !== undefined) {
        if (updates.asset_id) params.set("asset_id", updates.asset_id);
        else params.delete("asset_id");
      }
      if (updates.sampling_point_id !== undefined) {
        if (updates.sampling_point_id)
          params.set("sampling_point_id", updates.sampling_point_id);
        else params.delete("sampling_point_id");
      }
      if (updates.lab_name !== undefined) {
        if (updates.lab_name.trim())
          params.set("lab_name", updates.lab_name.trim());
        else params.delete("lab_name");
      }
      const q = params.toString();
      router.push(`/samples${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  const siteOptions = [
    { label: "All sites", onClickFn: () => updateUrl({ site_id: "" }) },
    ...sites.map((site) => ({
      label: site.name,
      onClickFn: () => updateUrl({ site_id: site.id }),
    })),
  ];

  const assetOptions = [
    { label: "All assets", onClickFn: () => updateUrl({ asset_id: "" }) },
    ...assets.map((asset) => ({
      label: asset.name,
      onClickFn: () => updateUrl({ asset_id: asset.id }),
    })),
  ];

  const samplingPointOptions = [
    {
      label: "All sampling points",
      onClickFn: () => updateUrl({ sampling_point_id: "" }),
    },
    ...samplingPoints.map((sp) => ({
      label: sp.name,
      onClickFn: () => updateUrl({ sampling_point_id: sp.id }),
    })),
  ];

  return (
    <div className="flex items-center gap-2">
      <DebouncedSearch
        value={search}
        onChange={(value) => updateUrl({ search: value })}
        debounceTime={400}
        placeholder="Search samples"
        className="h-10 max-w-[296px]"
      />

      {sites.length > 0 && (
        <Dropdown
          actions={siteOptions}
          contentClassName="absolute top-[-36px] right-[2px]"
        >
          <Button
            variant="outline"
            size="medium"
            className="border border-gray-100 group"
          >
            <Icon
              icon="hugeicons:plus-sign-circle"
              className="text-black size-4 group-hover:text-white"
            />
            {site_id
              ? sites.find((s) => s.id === site_id)?.name ?? "Site"
              : "Site"}
          </Button>
        </Dropdown>
      )}

      {assets.length > 0 && (
        <Dropdown
          actions={assetOptions}
          contentClassName="absolute top-[-36px] right-[2px]"
        >
          <Button
            variant="outline"
            size="medium"
            className="border border-gray-100 group"
          >
            <Icon
              icon="hugeicons:plus-sign-circle"
              className="text-black size-4 group-hover:text-white"
            />
            {asset_id
              ? assets.find((a) => a.id === asset_id)?.name ?? "Asset"
              : "Asset"}
          </Button>
        </Dropdown>
      )}

      {samplingPoints.length > 0 && (
        <Dropdown
          actions={samplingPointOptions}
          contentClassName="absolute top-[-36px] right-[2px]"
        >
          <Button
            variant="outline"
            size="medium"
            className="border border-gray-100 group"
          >
            <Icon
              icon="hugeicons:plus-sign-circle"
              className="text-black size-4 group-hover:text-white"
            />
            {sampling_point_id
              ? samplingPoints.find((sp) => sp.id === sampling_point_id)
                ?.name ?? "Sampling point"
              : "Sampling point"}
          </Button>
        </Dropdown>
      )}
    </div>
  );
}
