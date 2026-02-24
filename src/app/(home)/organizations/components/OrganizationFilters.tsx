"use client";

import React, { useCallback } from "react";
import {
  Button,
  DebouncedSearch,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@/components";
import { Icon } from "@/libs";
import { useRouter, useSearchParams } from "next/navigation";
import { INDUSTRIES, TEAM_SIZES } from "@/helpers/common";

export function OrganizationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const industry = searchParams.get("industry") ?? "";
  const team_size = searchParams.get("team_size") ?? "";

  const updateUrl = useCallback(
    (updates: { search?: string; industry?: string; team_size?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      if (updates.industry !== undefined) {
        if (updates.industry) params.set("industry", updates.industry);
        else params.delete("industry");
      }
      if (updates.team_size !== undefined) {
        if (updates.team_size) params.set("team_size", updates.team_size);
        else params.delete("team_size");
      }
      const q = params.toString();
      router.push(`/organizations${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  const handleIndustryChange = (value: string) => {
    updateUrl({ industry: value });
  };

  const handleTeamSizeChange = (value: string) => {
    updateUrl({ team_size: value });
  };

  const industryLabel = industry || "Industry";
  const teamSizeLabel = team_size || "Team Size";

  return (
    <div className="flex items-center gap-2">
      <DebouncedSearch
        value={search}
        onChange={(value) => updateUrl({ search: value })}
        debounceTime={400}
        placeholder="Search by name, description, or industry"
        className="h-10 max-w-[296px]"
      />

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
            {industryLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px] max-h-[280px] overflow-y-auto">
          <div className="flex flex-col">
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleIndustryChange("")}
            >
              <Text variant="span">All industries</Text>
            </button>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => handleIndustryChange(ind)}
              >
                <Text variant="span">{ind}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

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
            {teamSizeLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleTeamSizeChange("")}
            >
              <Text variant="span">All team sizes</Text>
            </button>
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => handleTeamSizeChange(size)}
              >
                <Text variant="span">{size}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
