"use client";

import React, { useMemo, useState } from "react";
import {
  Text,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Icon } from "@/libs";
import { Recommendation } from "@/types";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RecommendationTrendProps {
  recommendations: Recommendation[];
}

const timeFilterOptions = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-3-months", label: "Last 3 months" },
];

// Color scheme matching the design
const colors = {
  open: "#000000", // Black
  overdue: "#4B5563", // Dark gray
  critical: "#9CA3AF", // Light gray
  completed: "#6B7280", // Medium gray
};

export function RecommendationTrend({
  recommendations = [],
}: RecommendationTrendProps) {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("last-3-months");

  // Filter recommendations based on time filter
  const filteredRecommendations = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    if (selectedTimeFilter === "last-7-days") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (selectedTimeFilter === "last-30-days") {
      cutoffDate.setDate(now.getDate() - 30);
    } else {
      // Last 3 months
      cutoffDate.setMonth(now.getMonth() - 3);
    }

    return recommendations.filter((rec) => {
      const createdDate = new Date(rec.created_at_datetime);
      return createdDate >= cutoffDate;
    });
  }, [recommendations, selectedTimeFilter]);

  // Calculate counts for each category
  const chartData = useMemo(() => {
    const openCount = filteredRecommendations.filter(
      (rec) => rec.status === "open"
    ).length;

    const overdueCount = filteredRecommendations.filter(
      (rec) => rec.status === "overdue"
    ).length;

    const criticalCount = filteredRecommendations.filter(
      (rec) => rec.severity === "critical"
    ).length;

    const completedCount = filteredRecommendations.filter(
      (rec) => rec.status === "completed"
    ).length;

    const data = [
      {
        name: "Open",
        value: openCount,
        color: colors.open,
      },
      {
        name: "Overdue",
        value: overdueCount,
        color: colors.overdue,
      },
      {
        name: "Critical",
        value: criticalCount,
        color: colors.critical,
      },
      {
        name: "Completed",
        value: completedCount,
        color: colors.completed,
      },
    ].filter((item) => item.value > 0); // Only show categories with data

    return data;
  }, [filteredRecommendations]);

  const totalCount = filteredRecommendations.length;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: (typeof chartData)[0];
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalCount > 0 ? ((data.value / totalCount) * 100).toFixed(1) : "0";
      return (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="text-sm font-bold text-gray-900">{data.name}</p>
          </div>
          <p className="text-sm text-gray-700 font-medium">
            {data.value} recommendations
          </p>
          <p className="text-xs text-gray-500">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border border-gray-200 py-[12.8px] px-[19.8px]">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Text variant="h6" className="font-semibold text-gray-900 mb-1">
            Recommendation Trend
          </Text>
          <Text variant="span" className="text-sm text-gray-500">
            Total for the last 3 months
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200 rounded-md">
            <Icon icon="mdi:download" className="w-4 h-4" />
            Export
          </button>
          <Select
            value={selectedTimeFilter}
            onValueChange={setSelectedTimeFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 ? (
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 1000 }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Text variant="h4" className="font-bold text-gray-900">
                {totalCount}
              </Text>
              <Text variant="span" className="text-sm text-gray-500">
                Recommendations
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <Text variant="span" className="text-gray-500">
            No recommendations data available
          </Text>
        </div>
      )}

      {/* Legend */}
      {chartData.length > 0 && (
        <div className="flex items-center gap-4 justify-center flex-wrap">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <Text variant="span" className="text-sm text-gray-700">
                {item.name}
              </Text>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0 bg-black" />
            <Text variant="span" className="text-sm text-gray-700">
              Total
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}






