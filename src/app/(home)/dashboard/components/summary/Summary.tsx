"use client";
import { Text } from "@/components";
import { getTrendData } from "@/utils";
import { Icon } from "@iconify/react";
import React from "react";
import { AlarmAnalytics, RecommendationAnalytics } from "@/types";
import { AssetAnalytics } from "@/types/inventory";

export const Summary = ({
  assetsAnalytics,
  alarmsAnalytics,
  recommendationsAnalytics,
}: {
  assetsAnalytics: AssetAnalytics | null;
  alarmsAnalytics: AlarmAnalytics | null;
  recommendationsAnalytics: RecommendationAnalytics | null;
}) => {
  const cardData = [
    {
      id: 1,
      title: "Total Assets",
      value: assetsAnalytics?.total_assets || 0,
      description: "This is the total value of all your assets.",
      label: getTrendData(assetsAnalytics?.asset_trend?.percentage || 0),
      icon: "mdi:trending-up",
    },
    {
      id: 2,
      title: "Total Alarms",
      value: alarmsAnalytics?.total_alarms || 0,
      description: "This is the total of all your alarms.",
      label: getTrendData(alarmsAnalytics?.alarm_trend?.percentage || 0),
      icon: "mdi:trending-up",
    },
    {
      id: 3,
      title: "Total Alerts",
      value: "10",
      description: "This is the total of all your alerts.",
      label: "Trending up this week",
      icon: "mdi:trending-up",
    },
    {
      id: 4,
      title: "Total Recommendations",
      value: recommendationsAnalytics?.total_count || 0,
      description: "This is the total of all your recommendations.",
      label: getTrendData(
        recommendationsAnalytics?.total_trend_percentage || 0
      ),
      icon: "mdi:trending-up",
    },
  ];
  return (
    <>
      {/* summary section */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Icon icon="mdi:trending-up" />
                <Text variant="span">{item.value}</Text>
              </div>
            </div>
            <Text variant="h6">{item.value}</Text>
            <div className="flex items-center gap-2 px-[6.4px] py-[4.8px]">
              <Text variant="span">{item.label?.label}</Text>
              <Icon icon="mdi:trending-up" />
            </div>
            <Text variant="span" className="text-gray">
              {item.description}
            </Text>
          </div>
        ))}
      </section>
    </>
  );
};
