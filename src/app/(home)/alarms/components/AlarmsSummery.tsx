"use client";
import { Text } from "@/components";
import { Icon } from "@/libs";
import React from "react";
import { AlarmAnalytics } from "@/types";
import { getTrendData } from "@/utils";

export const AlarmsSummery = ({
  alarmsAnalytics,
}: {
  alarmsAnalytics: AlarmAnalytics;
}) => {
  const cardData = [
    {
      id: 1,
      title: "Total Alarms",
      value: alarmsAnalytics?.total_alarms || 0,
      description: "This is the total of all your alarms.",
      trend: getTrendData(alarmsAnalytics?.alarm_trend?.percentage || 0),
    },
    {
      id: 2,
      title: "Open/Overdue Alarms",
      value: alarmsAnalytics?.open_overdue_alarms || 0,
      description: "This is the total of all your open and overdue alarms.",
      trend: getTrendData(alarmsAnalytics?.open_overdue_trend?.percentage || 0),
    },
    {
      id: 3,
      title: "Forecast Alarms",
      value: alarmsAnalytics?.forecast_alarms || 0,
      description: "This is the forecasted number of alarms.",
      trend: getTrendData(alarmsAnalytics?.forecast_trend?.percentage || 0),
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
