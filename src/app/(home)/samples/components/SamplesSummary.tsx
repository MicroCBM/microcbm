"use client";
import { Text } from "@/components";
import { Icon } from "@/libs";
import React from "react";
import { SamplingPointAnalytics } from "@/types";
import { getTrendData } from "@/utils";

export const SamplesSummary = ({
  samplingPointsAnalytics,
}: {
  samplingPointsAnalytics: SamplingPointAnalytics | null;
}) => {
  // Don't render if analytics data is not available
  if (!samplingPointsAnalytics) {
    return null;
  }
  const cardData = [
    {
      id: 1,
      title: "Total Sampling Points",
      value: samplingPointsAnalytics?.total_sampling_points || 0,
      description: "This is the total of all your sampling points.",
      trend: getTrendData(samplingPointsAnalytics?.total_trend_percentage || 0),
    },
    {
      id: 2,
      title: "Sampling Points Due",
      value: samplingPointsAnalytics?.sampling_points_due || 0,
      description: "Sampling points that are due for sampling.",
      trend: getTrendData(samplingPointsAnalytics?.due_trend_percentage || 0),
    },
    {
      id: 3,
      title: "Overdue Sampling Points",
      value: samplingPointsAnalytics?.sampling_points_overdue || 0,
      description: "Sampling points that are overdue for sampling.",
      trend: getTrendData(
        samplingPointsAnalytics?.overdue_trend_percentage || 0
      ),
    },
  ];

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardData.map((item) => (
        <div
          key={item.id}
          className="border border-gray-100 py-[12.8px] px-[19.8px]"
        >
          <div className="flex items-center justify-between">
            <Text variant="span" className="text-gray">
              {item.title}
            </Text>
            <div className="flex items-center gap-2 border border-gray-100 px-[6.4px] py-[4.8px]">
              <Icon icon={item.trend.icon} />
              <Text variant="span">{item.trend.label.split("%")[0]}%</Text>
            </div>
          </div>
          <Text variant="h6">{item.value}</Text>
          <div className="flex items-center gap-2 px-[6.4px] py-[4.8px]">
            <Text variant="span">{item.trend.label}</Text>
            <Icon icon={item.trend.icon} />
          </div>
          <Text variant="span" className="text-gray">
            {item.description}
          </Text>
        </div>
      ))}
    </section>
  );
};
