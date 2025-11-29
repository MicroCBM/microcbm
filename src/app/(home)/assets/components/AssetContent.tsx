"use client";
import React from "react";
import { AssetFilters } from "./AssetFilters";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import Link from "next/link";
import { ComponentGuard } from "@/components/content-guard";
import { Sites } from "@/types";

export function AssetContent({ sites }: { sites: Sites[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Assets</Text>
        <ComponentGuard permissions="assets:create">
          <Link href="/assets/add">
            <Button size="medium" className="rounded-full">
              <Icon icon="mdi:plus-circle" className="text-white size-5" />
              Add New Asset
            </Button>
          </Link>
        </ComponentGuard>
      </div>
      <AssetFilters sites={sites} />
    </div>
  );
}
