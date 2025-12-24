"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AssetFilters } from "./AssetFilters";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import { Sites } from "@/types";

export function AssetContent({ sites }: { sites: Sites[] }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Assets</Text>
        <Button
          onClick={() => router.push("/assets/add")}
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
