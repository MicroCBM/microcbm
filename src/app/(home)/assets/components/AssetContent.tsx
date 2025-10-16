"use client";
import React from "react";
import { AssetFilters } from "./AssetFilters";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import Link from "next/link";

export function AssetContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Assets</Text>
        <Link href="/assets/add">
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Asset
          </Button>
        </Link>
      </div>
      <AssetFilters />
    </div>
  );
}
