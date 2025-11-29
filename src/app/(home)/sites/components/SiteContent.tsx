"use client";
import React from "react";
import { Text, Button } from "@/components";
import { ComponentGuard } from "@/components/content-guard";
import { Icon } from "@/libs";
import Link from "next/link";
import { SiteFilters } from "./SiteFilters";
import { Organization, Sites } from "@/types";

export function SiteContent({
  organizations,
  sites,
}: {
  organizations: Organization[];
  sites: Sites[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Sites</Text>
        <ComponentGuard permissions="sites:create">
          <Link href="/sites/add">
            <Button size="medium" className="rounded-full">
              <Icon icon="mdi:plus-circle" className="text-white size-5" />
              Add New Site
            </Button>
          </Link>
        </ComponentGuard>
      </div>
      <SiteFilters organizations={organizations} sites={sites} />
    </div>
  );
}
