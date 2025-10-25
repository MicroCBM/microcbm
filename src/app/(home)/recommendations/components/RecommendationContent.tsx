"use client";

import React from "react";
import { Button, Text } from "@/components";

import { Icon } from "@/libs";
import { useRouter } from "next/navigation";

export function RecommendationContent() {
  const router = useRouter();
  const handleAddRecommendation = () => {
    router.push("/recommendations/add");
  };
  return (
    <div className="flex items-center justify-between">
      <Text variant="h6" className="text-gray-900">
        Recommendations
      </Text>

      <Button
        onClick={handleAddRecommendation}
        size="medium"
        className="rounded-full"
      >
        <Icon icon="mdi:plus-circle" className="text-white size-5" />
        Add New Recommendation
      </Button>
    </div>
  );
}
