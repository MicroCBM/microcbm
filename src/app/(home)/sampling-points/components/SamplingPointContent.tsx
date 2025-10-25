"use client";
import React from "react";
import { SamplingPointFilters } from "./SamplingPointFilters";
import { Text, Button } from "@/components";
import { Icon } from "@/libs";
import Link from "next/link";

export function SamplingPointContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Sampling Points</Text>
        <Link href="/sampling-points/add">
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Sampling Point
          </Button>
        </Link>
      </div>
      <SamplingPointFilters />
    </div>
  );
}
