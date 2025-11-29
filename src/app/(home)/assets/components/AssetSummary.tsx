"use client";

import React from "react";
import { Text } from "@/components";
import { Icon } from "@/libs";
import { AssetAnalytics } from "@/types";
import { getTrendData } from "@/utils";

interface AssetSummaryProps {
  assetsAnalytics: AssetAnalytics;
}

export function AssetSummary({ assetsAnalytics }: AssetSummaryProps) {
  const cardData = [
    {
      id: 1,
      title: "Total Assets",
      value: assetsAnalytics?.total_assets || 0,
      description: "This is the total of all your assets.",
      trend: getTrendData(assetsAnalytics?.asset_trend?.percentage || 0),
    },
    {
      id: 2,
      title: "Critical Assets",
      value: assetsAnalytics?.critical_assets?.total || 0,
      description: "This is the total of all your critical assets.",
      trend: getTrendData(
        assetsAnalytics?.critical_assets?.trend?.percentage || 0
      ),
    },
    {
      id: 3,
      title: "Assets with Alarms",
      value: assetsAnalytics?.assets_with_alarms?.total || 0,
      description: "This is the total of all your assets with alarms.",
      trend: getTrendData(
        assetsAnalytics?.assets_with_alarms?.trend?.percentage || 0
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
}
