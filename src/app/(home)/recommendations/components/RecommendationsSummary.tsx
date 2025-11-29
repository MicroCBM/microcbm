"use client";

import React, { useState, useMemo } from "react";
import { Text, BarChart } from "@/components";
import { Icon } from "@/libs";
import { RecommendationAnalytics } from "@/types";
import { getTrendData } from "@/utils";
import { ComponentGuard } from "@/components/content-guard";

interface RecommendationsSummaryProps {
  recommendationAnalytics: RecommendationAnalytics[];
}

const timeFilterTabs = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-3-months", label: "Last 3 months" },
];

export function RecommendationsSummary({
  recommendationAnalytics = [],
}: RecommendationsSummaryProps) {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("last-3-months");

  // Get the latest month's analytics (most recent entry)
  const latestAnalytics =
    recommendationAnalytics.length > 0
      ? recommendationAnalytics[recommendationAnalytics.length - 1]
      : null;

  // Prepare chart data from analytics
  const chartData = useMemo(() => {
    // Sort by month to ensure chronological order
    const sortedAnalytics = [...recommendationAnalytics].sort((a, b) => {
      if (a.month < b.month) return -1;
      if (a.month > b.month) return 1;
      return 0;
    });

    // Filter based on selected time filter
    let filteredData = sortedAnalytics;
    if (selectedTimeFilter === "last-3-months") {
      // Show last 3 months
      filteredData = sortedAnalytics.slice(-3);
    } else if (selectedTimeFilter === "last-30-days") {
      // Show last month
      filteredData = sortedAnalytics.slice(-1);
    } else {
      // Last 7 days - show last month's data
      filteredData = sortedAnalytics.slice(-1);
    }

    return filteredData.map((item) => ({
      month: item.month,
      value1: item.total_count,
      value2: item.overdue_count,
    }));
  }, [recommendationAnalytics, selectedTimeFilter]);

  const cardData = [
    {
      id: 1,
      title: "Total Recommendations",
      value: latestAnalytics?.total_count || 0,
      description: "This is the total of all your recommendations.",
      trend: getTrendData(latestAnalytics?.total_trend_percentage || 0),
    },
    {
      id: 2,
      title: "Open/Overdue Recommendations",
      value: latestAnalytics?.open_overdue_count || 0,
      description:
        "This is the total of all your open and overdue recommendations.",
      trend: getTrendData(latestAnalytics?.open_overdue_trend_percentage || 0),
    },
    {
      id: 3,
      title: "Overdue Recommendations",
      value: latestAnalytics?.overdue_count || 0,
      description: "This is the total of all your overdue recommendations.",
      trend: getTrendData(latestAnalytics?.overdue_trend_percentage || 0),
    },
  ];

  return (
    <ComponentGuard permissions="recommendations:read" loadingFallback={null}>
      <div className="flex flex-col gap-4">
        {/* Summary Cards */}
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

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <BarChart
            data={chartData}
            title="Total Recommendations"
            subtitle="Total for the last 3 months"
            value1Label="Total"
            value2Label="Overdue"
            timeFilterTabs={timeFilterTabs}
            onTimeFilterChange={setSelectedTimeFilter}
            selectedTimeFilter={selectedTimeFilter}
          />
        )}
      </div>
    </ComponentGuard>
  );
}
