"use client";

import React, { useCallback } from "react";
import { Button, DebouncedSearch } from "@/components";
import { Icon } from "@/libs";
import { useRouter, useSearchParams } from "next/navigation";
import { Organization, Sites } from "@/types";
import { Dropdown } from "@/components/dropdown";

const USER_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

interface RoleOption {
  id: string;
  name: string;
}

interface UserFiltersProps {
  organizations?: Organization[];
  sites?: Sites[];
  rolesData?: RoleOption[];
}

export function UserFilters({
  organizations = [],
  sites = [],
  rolesData = [],
}: UserFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const role = searchParams.get("role") ?? "";
  const site_id = searchParams.get("site_id") ?? "";
  const organization_id = searchParams.get("organization_id") ?? "";

  const updateUrl = useCallback(
    (updates: {
      search?: string;
      status?: string;
      role?: string;
      site_id?: string;
      organization_id?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set("search", updates.search.trim());
        else params.delete("search");
      }
      if (updates.status !== undefined) {
        if (updates.status) params.set("status", updates.status);
        else params.delete("status");
      }
      if (updates.role !== undefined) {
        if (updates.role) params.set("role", updates.role);
        else params.delete("role");
      }
      if (updates.site_id !== undefined) {
        if (updates.site_id) params.set("site_id", updates.site_id);
        else params.delete("site_id");
      }
      if (updates.organization_id !== undefined) {
        if (updates.organization_id)
          params.set("organization_id", updates.organization_id);
        else params.delete("organization_id");
      }
      const q = params.toString();
      router.push(`/user-management${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  const statusLabel =
    USER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "Status";
  const roleLabel =
    rolesData.find((r) => r.name === role)?.name ?? "Role";
  const siteLabel =
    sites.find((s) => s.id === site_id)?.name ?? "Site";
  const organizationLabel =
    organizations.find((o) => o.id === organization_id)?.name ?? "Organization";

  const statusActions = USER_STATUS_OPTIONS.map((opt) => ({
    label: opt.label,
    onClickFn: () => updateUrl({ status: opt.value }),
  }));

  const roleActions = [
    { label: "All roles", onClickFn: () => updateUrl({ role: "" }) },
    ...rolesData.map((r) => ({
      label: r.name,
      onClickFn: () => updateUrl({ role: r.name }),
    })),
  ];

  const siteActions = [
    { label: "All sites", onClickFn: () => updateUrl({ site_id: "" }) },
    ...sites.map((site) => ({
      label: site.name,
      onClickFn: () => updateUrl({ site_id: site.id }),
    })),
  ];

  const organizationActions = [
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
    <div className="flex items-center gap-2 flex-wrap">
      <DebouncedSearch
        value={search}
        onChange={(value) => updateUrl({ search: value })}
        debounceTime={400}
        placeholder="Search by name, email, or phone"
        className="h-10 max-w-[296px]"
      />

      <Dropdown
        actions={statusActions}
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
          {statusLabel}
        </Button>
      </Dropdown>

      {rolesData.length > 0 && (
        <Dropdown
          actions={roleActions}
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
            {roleLabel}
          </Button>
        </Dropdown>
      )}

      {sites.length > 0 && (
        <Dropdown
          actions={siteActions}
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
            {siteLabel}
          </Button>
        </Dropdown>
      )}

      {organizations.length > 0 && (
        <Dropdown
          actions={organizationActions}
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
            {organizationLabel}
          </Button>
        </Dropdown>
      )}
    </div>
  );
}
