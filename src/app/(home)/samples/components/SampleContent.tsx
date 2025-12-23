"use client";

import React from "react";
import { Button, Text } from "@/components";
import { Icon } from "@/libs";
import { Asset, SamplingPoint, Sites } from "@/types";
import { useRouter } from "next/navigation";

export function SampleContent({
  sites,
  assets,
  samplingPoints,
}: {
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}) {
  const router = useRouter();
  console.log(sites, assets, samplingPoints);
  return (
    <div className="flex items-center justify-between">
      <div>
        <Text variant="h4" className="text-gray-900">
          Samples
        </Text>
        <Text variant="p" className="text-gray-600">
          Manage and monitor oil analysis samples
        </Text>
      </div>
      <Button
        permissions="samples:create"
        onClick={() => router.push("/samples/add")}
        size="medium"
        className="rounded-full cursor-pointer"
      >
        <Icon icon="mdi:plus-circle" className="text-white size-5" />
        Add New Sample
      </Button>
    </div>
  );
}
