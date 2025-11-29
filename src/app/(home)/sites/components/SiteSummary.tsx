"use client";

import React from "react";
import { Text } from "@/components";
import { Icon } from "@/libs";
import { SitesAnalytics } from "@/types";
import { getTrendData } from "@/utils";

interface SiteSummaryProps {
  sitesAnalytics: SitesAnalytics;
}

export function SiteSummary({ sitesAnalytics }: SiteSummaryProps) {
  const cardData = [
    {
      id: 1,
      title: "Total Sites",
      value: sitesAnalytics?.total_sites || 0,
      description: "This is the total of all your sites.",
      trend: getTrendData(sitesAnalytics?.sites_trend_percentage || 0),
    },
    {
      id: 2,
      title: "Sites with Issues",
      value: sitesAnalytics?.sites_with_issues || 0,
      description: "This is the total of all your sites with issues.",
      trend: getTrendData(sitesAnalytics?.issues_trend_percentage || 0),
    },
  ];

  return (
    <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
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
