"use client";

import React from "react";
import { Text } from "@/components";
import { Recommendation } from "@/types";

interface RecommendationsSummaryProps {
  recommendations?: Recommendation[];
}

export function RecommendationsSummary({
  recommendations = [],
}: RecommendationsSummaryProps) {
  // Calculate summary statistics
  const totalRecommendations = recommendations.length;
  const criticalRecommendations = recommendations.filter(
    (r) => r.severity === "critical"
  ).length;
  const highRecommendations = recommendations.filter(
    (r) => r.severity === "high"
  ).length;
  const mediumRecommendations = recommendations.filter(
    (r) => r.severity === "medium"
  ).length;

  const summaryCards = [
    {
      id: 1,
      title: "Total Recommendations",
      value: totalRecommendations.toString(),
      description: "All recommendations",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "Critical",
      value: criticalRecommendations.toString(),
      description: "Requires immediate attention",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 3,
      title: "High Priority",
      value: highRecommendations.toString(),
      description: "High priority items",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 4,
      title: "Medium Priority",
      value: mediumRecommendations.toString(),
      description: "Medium priority items",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card) => (
        <div
          key={card.id}
          className={`border border-gray-200 p-4 rounded-lg ${card.bgColor}`}
        >
          <div className="flex items-center justify-between mb-2">
            <Text variant="span" className="text-sm text-gray-600">
              {card.title}
            </Text>
          </div>
          <Text variant="h3" className={`font-bold ${card.color} mb-1`}>
            {card.value}
          </Text>
          <Text variant="span" className="text-xs text-gray-500">
            {card.description}
          </Text>
        </div>
      ))}
    </div>
  );
}
