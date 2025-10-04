"use client";

import React from "react";
import { Icon } from "@/libs";
import { Text } from "@/components";
import { cn } from "@/libs";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PieChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface PieChartProps {
  title: string;
  subtitle: string;
  data: PieChartData[];
  centerValue: number;
  centerLabel: string;
  className?: string;
}

export function PieChart({
  title,
  subtitle,
  data,
  centerValue,
  centerLabel,
  className,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: PieChartData }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
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
            {data.value} samples
          </p>
          <p className="text-xs text-gray-500">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("border border-gray-200 p-6", className)}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Text variant="h6" className="font-semibold text-gray-900 mb-1">
            {title}
          </Text>
          <Text variant="span" className="text-sm text-gray-500">
            {subtitle}
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200">
            <Icon icon="mdi:download" className="w-4 h-4" />
            Export
          </button>
          <div className="relative">
            <input
              type="date"
              className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              defaultValue="2024-05-12"
            />
            <Icon
              icon="mdi:calendar"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
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
                {data.map((entry, index) => (
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
              {centerValue}
            </Text>
            <Text variant="span" className="text-sm text-gray-500">
              {centerLabel}
            </Text>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex items-center gap-2 justify-center">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <Text variant="span" className="text-sm text-gray-700">
              {item.name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
