"use client";

import React, { useCallback } from "react";
import { Button } from "@/components";
import { Dropdown } from "@/components/dropdown";
import { Icon } from "@/libs";
import { useRouter, useSearchParams } from "next/navigation";
import { Sites } from "@/types";

const SEVERITY_OPTIONS = [
  { value: "", label: "All severities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

interface AlarmFiltersProps {
  sites: Sites[];
}

export function AlarmFilters({ sites = [] }: AlarmFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const site_id = searchParams.get("site_id") ?? "";
  const severity = searchParams.get("severity") ?? "";

  const updateUrl = useCallback(
    (updates: { site_id?: string; severity?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.site_id !== undefined) {
        if (updates.site_id) params.set("site_id", updates.site_id);
        else params.delete("site_id");
      }
      if (updates.severity !== undefined) {
        if (updates.severity) params.set("severity", updates.severity);
        else params.delete("severity");
      }
      const q = params.toString();
      router.push(`/alarms${q ? `?${q}` : ""}`);
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

  const severityLabel =
    SEVERITY_OPTIONS.find((o) => o.value === severity)?.label ?? "Severity";

  return (
    <div className="flex items-center gap-2">
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

      <Dropdown
        actions={SEVERITY_OPTIONS.map((opt) => ({
          label: opt.label,
          onClickFn: () => updateUrl({ severity: opt.value }),
        }))}
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
          {severityLabel}
        </Button>
      </Dropdown>
    </div>
  );
}
