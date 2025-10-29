"use client";
import React from "react";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import Link from "next/link";
import { SamplingRouteFilters } from "./SamplingRouteFilters";

export function SamplingRouteContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Sampling Routes</Text>
        <Link href="/sampling-routes/add">
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Sampling Route
          </Button>
        </Link>
      </div>
      <SamplingRouteFilters />
    </div>
  );
}
