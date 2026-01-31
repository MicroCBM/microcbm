"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ChartData {
  month: string;
  value1: number;
  value2?: number;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
  subtitle: string;
  value1Label?: string;
  value2Label?: string;
  className?: string;
  timeFilterTabs?: {
    value: string;
    label: string;
  }[];
  onTimeFilterChange?: (value: string) => void;
  selectedTimeFilter?: string;
}

export function BarChart({
  data,
  title,
  subtitle,
  value1Label = "Series 1",
  value2Label = "Series 2",
  className,
  timeFilterTabs,
  onTimeFilterChange,
  selectedTimeFilter,
}: BarChartProps) {
  // Format month from "2025-11" to "November" or "Nov"
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  // Calculate max value for Y-axis
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.value1, d.value2 || 0]),
    100
  );
  const yAxisMax = Math.ceil(maxValue / 50) * 50; // Round up to nearest 50

  return (
    <div className={`border border-gray-100 py-[12.8px] px-[19.8px] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {timeFilterTabs && onTimeFilterChange && (
          <div className="flex items-center gap-2">
            {timeFilterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTimeFilterChange(tab.value)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedTimeFilter === tab.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E5E5"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatMonth}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, yAxisMax]}
              ticks={Array.from({ length: 7 }, (_, i) => (i * yAxisMax) / 6)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                value ?? "—",
                String(name ?? "") === "value1" ? value1Label : value2Label,
              ]}
              labelFormatter={(label) => formatMonth(label)}
            />
            <Bar
              dataKey="value1"
              fill="#000"
              radius={[0, 0, 0, 0]}
              barSize={20}
            />
            {data.some((d) => d.value2 !== undefined) && (
              <Bar
                dataKey="value2"
                fill="#333"
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

