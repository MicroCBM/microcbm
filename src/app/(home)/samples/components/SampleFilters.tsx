"use client";

import React, { useCallback } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Search,
  Text,
} from "@/components";
import { Icon } from "@/libs";
import { useRouter, useSearchParams } from "next/navigation";
import { Sites } from "@/types";
import { Dropdown } from "@/components/dropdown";

const SEVERITY_OPTIONS = [
  { value: "", label: "All severities" },
  { value: "normal", label: "Normal" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "urgent", label: "Urgent" },
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
];

interface SampleFiltersProps {
  sites?: Sites[];
}

export function SampleFilters({ sites = [] }: SampleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const site_id = searchParams.get("site_id") ?? "";
  const severity = searchParams.get("severity") ?? "";

  const updateUrl = useCallback(
    (updates: { search?: string; site_id?: string; severity?: string }) => {
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
      if (updates.severity !== undefined) {
        if (updates.severity) params.set("severity", updates.severity);
        else params.delete("severity");
      }
      const q = params.toString();
      router.push(`/samples${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  const handleSearchChange = (value: string) => {
    updateUrl({ search: value });
  };

  const handleSeverityChange = (value: string) => {
    updateUrl({ severity: value });
  };

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
      <Search
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
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

      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {SEVERITY_OPTIONS.map((opt) => (
              <button
                key={opt.value || "all"}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => handleSeverityChange(opt.value)}
              >
                <Text variant="span">{opt.label}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
