"use client";
import React from "react";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import Link from "next/link";
import { SiteFilters } from "./SiteFilters";
import { Organization } from "@/types";

export function SiteContent({
  organizations,
}: {
  organizations: Organization[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Sites</Text>
        <Link href="/sites/add">
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Site
          </Button>
        </Link>
      </div>
      <SiteFilters organizations={organizations} />
    </div>
  );
}
