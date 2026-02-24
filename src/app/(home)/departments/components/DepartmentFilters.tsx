"use client";

import React, { useCallback } from "react";
import { Button, DebouncedSearch } from "@/components";
import { Icon } from "@/libs";
import { useRouter, useSearchParams } from "next/navigation";
import { Organization } from "@/types";
import { Dropdown } from "@/components/dropdown";

interface DepartmentFiltersProps {
  organizations?: Organization[];
}

export function DepartmentFilters({ organizations = [] }: DepartmentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const organization_id = searchParams.get("organization_id") ?? "";

  const updateUrl = useCallback(
    (updates: { search?: string; organization_id?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      if (updates.organization_id !== undefined) {
        if (updates.organization_id)
          params.set("organization_id", updates.organization_id);
        else params.delete("organization_id");
      }
      const q = params.toString();
      router.push(`/departments${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  const organizationOptions = [
    {
      label: "All organizations",
      onClickFn: () => updateUrl({ organization_id: "" }),
    },
    ...organizations.map((org) => ({
      label: org.name,
      onClickFn: () => updateUrl({ organization_id: org.id }),
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <DebouncedSearch
          value={search}
          onChange={(value) => updateUrl({ search: value })}
          debounceTime={400}
          placeholder="Search by name or description"
          className="h-10 max-w-[296px]"
        />

        {organizations.length > 0 && (
          <Dropdown
            actions={organizationOptions}
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
              {organization_id
                ? organizations.find((o) => o.id === organization_id)?.name ??
                  "Organization"
                : "Organization"}
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
}
