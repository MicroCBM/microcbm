"use client";
import React from "react";
import { AssetFilters } from "./AssetFilters";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import { Sites } from "@/types";

export function AssetContent({ sites }: { sites: Sites[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Assets</Text>
        <Button
          permissions="assets:create"
          size="medium"
          className="rounded-full cursor-pointer"
        >
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Add New Asset
        </Button>
      </div>
      <AssetFilters sites={sites} />
    </div>
  );
}
