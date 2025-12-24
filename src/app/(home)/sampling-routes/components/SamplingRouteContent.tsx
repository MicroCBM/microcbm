"use client";
import React from "react";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import { SamplingRouteFilters } from "./SamplingRouteFilters";
import { useRouter } from "next/navigation";

export function SamplingRouteContent() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text variant="h6">Sampling Routes</Text>
        <Button
          permissions="sampling_routes:create"
          size="medium"
          className="rounded-full cursor-pointer"
          onClick={() => router.push("/sampling-routes/add")}
        >
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Add New Sampling Route
        </Button>
      </div>
      <SamplingRouteFilters />
    </div>
  );
}
