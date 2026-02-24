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
import { Organization } from "@/types";
import { STATUSES } from "@/utils";

interface SiteFiltersProps {
  organizations: Organization[];
}

export function SiteFilters({ organizations = [] }: SiteFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const organization_id = searchParams.get("organization_id") ?? "";

  const updateUrl = useCallback(
    (updates: {
      search?: string;
      status?: string;
      organization_id?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      if (updates.status !== undefined) {
        if (updates.status && updates.status !== "all")
          params.set("status", updates.status);
        else params.delete("status");
      }
      if (updates.organization_id !== undefined) {
        if (updates.organization_id)
          params.set("organization_id", updates.organization_id);
        else params.delete("organization_id");
      }
      const q = params.toString();
      router.push(`/sites${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  const handleStatusChange = (value: string) => {
    updateUrl({ status: value === "all" ? "" : value });
  };

  const handleOrganizationChange = (orgId: string) => {
    updateUrl({ organization_id: orgId });
  };

  const statusLabel =
    STATUSES.find((s) => s.value === status || (s.value === "all" && !status))
      ?.label ?? "Status";

  return (
    <div className="flex items-center gap-2">
      <DebouncedSearch
        value={search}
        onChange={(value) => updateUrl({ search: value })}
        debounceTime={400}
        placeholder="Search by name, description, city, or country"
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
            {statusLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => handleStatusChange(s.value)}
              >
                <Text variant="span">{s.label}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {organizations.length > 0 && (
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
              {organization_id
                ? organizations.find((o) => o.id === organization_id)?.name ??
                  "Organization"
                : "Organization"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[208px]">
            <div className="flex flex-col">
              <button
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => handleOrganizationChange("")}
              >
                <Text variant="span">All organizations</Text>
              </button>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  className="px-2 py-[6px] hover:bg-gray-100 text-left"
                  onClick={() => handleOrganizationChange(org.id)}
                >
                  <Text variant="span">{org.name}</Text>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
