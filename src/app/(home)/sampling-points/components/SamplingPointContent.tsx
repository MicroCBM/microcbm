"use client";
import React from "react";
import { SamplingPointFilters } from "./SamplingPointFilters";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import { useRouter } from "next/navigation";

export function SamplingPointContent() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text variant="h6">Sampling Points</Text>
        <Button
          onClick={() => router.push("/sampling-points/add")}
          size="medium"
          className="rounded-full cursor-pointer"
          // permissions="sampling_points:create"
        >
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Add New Sampling Point
        </Button>
      </div>
      <SamplingPointFilters />
    </div>
  );
}
