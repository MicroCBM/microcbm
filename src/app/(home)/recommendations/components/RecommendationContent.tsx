"use client";

import React from "react";
import { Button, Text } from "@/components";

import { Icon } from "@/libs";
import { useRouter } from "next/navigation";

export function RecommendationContent() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <Text variant="h6" className="text-gray-900">
        Recommendations
      </Text>

      <Button
        permissions="recommendations:create"
        onClick={() => router.push("/recommendations/add")}
        size="medium"
        className="rounded-full cursor-pointer"
      >
        <Icon icon="mdi:plus-circle" className="text-white size-5" />
        Add New Recommendation
      </Button>
    </div>
  );
}
