"use client";
import React from "react";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import { SiteFilters } from "./SiteFilters";
import { Organization, Sites } from "@/types";
import { useRouter } from "next/navigation";

export function SiteContent({
  organizations,
  sites,
}: {
  organizations: Organization[];
  sites: Sites[];
}) {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Sites</Text>

        <Button
          onClick={() => router.push("/sites/add")}
          permissions="sites:create"
          size="medium"
          className="rounded-full cursor-pointer"
        >
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Add New Site
        </Button>
      </div>
      <SiteFilters organizations={organizations} sites={sites} />
    </div>
  );
}
