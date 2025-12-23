"use client";
import React from "react";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import { SamplingRouteFilters } from "./SamplingRouteFilters";

export function SamplingRouteContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Sampling Routes</Text>
        <Button
          permissions="sampling-routes:create"
          size="medium"
          className="rounded-full cursor-pointer"
        >
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Add New Sampling Route
        </Button>
      </div>
      <SamplingRouteFilters />
    </div>
  );
}
