"use client";
import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import dayjs from "dayjs";

interface ChartDataPoint {
  date?: string;
  timestamp?: number;
  value?: number;
  element?: string;
  name?: string;
  count?: number;
  created_at_datetime?: string;
  date_sampled?: string;
  [key: string]: unknown;
}

interface GroupedChartData {
  date: string;
  [elementName: string]: string | number;
}

interface SampleAnalyticsChartProps {
  data: ChartDataPoint[];
  category?: string;
}

export function SampleAnalyticsChart({ data }: SampleAnalyticsChartProps) {
  // Transform data for the chart
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Check if data is already in grouped format (has series as properties)
    const firstItem = data[0];
    const isAlreadyGrouped = 
      firstItem && 
      typeof firstItem === "object" &&
      firstItem.date &&
      Object.keys(firstItem).some(key => 
        key !== "date" && 
        key !== "timestamp" && 
        key !== "element" && 
        key !== "name" && 
        key !== "value" && 
        key !== "count" &&
        key !== "label" &&
        key !== "created_at_datetime" &&
        key !== "date_sampled" &&
        typeof firstItem[key] === "number"
      );

    if (isAlreadyGrouped) {
      // Data is already grouped, just format dates and return
      return data.map((item: ChartDataPoint) => {
        const dateKey = item.date 
          ? dayjs(item.date).format("MMM DD")
          : (item.timestamp
              ? dayjs.unix(item.timestamp).format("MMM DD")
              : dayjs(
                  (item.created_at_datetime || item.date_sampled) as string
                ).format("MMM DD"));
        
        const result: GroupedChartData = { date: dateKey };
        
        // Copy all numeric properties (series) to result
        Object.keys(item).forEach(key => {
          if (key !== "date" && key !== "timestamp" && key !== "label" && 
              key !== "created_at_datetime" && key !== "date_sampled" &&
              typeof item[key] === "number") {
            result[key] = item[key] as number;
          }
        });
        
        return result;
      });
    }

    // Legacy format: Group data by date
    const groupedByDate = data.reduce(
      (acc: Record<string, GroupedChartData>, item: ChartDataPoint) => {
        const dateKey =
          item.date ||
          (item.timestamp
            ? dayjs.unix(item.timestamp).format("MMM DD")
            : dayjs(
                (item.created_at_datetime || item.date_sampled) as string
              ).format("MMM DD"));

        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey };
        }

        // Add values for different elements/series
        const elementName = (item.element || item.name || "value") as string;
        acc[dateKey][elementName] = item.value || item.count || 0;

        return acc;
      },
      {} as Record<string, GroupedChartData>
    );

    return Object.values(groupedByDate);
  }, [data]);

  // Get unique series names (elements)
  const seriesNames = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const names = new Set<string>();
    
    // Check if data is already grouped (has series as properties on each item)
    const firstItem = data[0];
    const hasGroupedFormat = 
      firstItem && 
      typeof firstItem === "object" &&
      Object.keys(firstItem).some(key => 
        key !== "date" && 
        key !== "timestamp" && 
        key !== "element" && 
        key !== "name" && 
        key !== "value" && 
        key !== "count" &&
        key !== "label" &&
        key !== "created_at_datetime" &&
        key !== "date_sampled" &&
        typeof firstItem[key] === "number"
      );

    if (hasGroupedFormat) {
      // Extract series names from property keys (exclude date and metadata fields)
      const excludedKeys = new Set([
        "date", "timestamp", "element", "name", "value", "count", 
        "label", "created_at_datetime", "date_sampled"
      ]);
      data.forEach((item: ChartDataPoint) => {
        Object.keys(item).forEach(key => {
          if (!excludedKeys.has(key) && typeof item[key] === "number") {
            names.add(key);
          }
        });
      });
    } else {
      // Legacy format: extract from element/name fields
      data.forEach((item: ChartDataPoint) => {
        if (item.element) names.add(item.element);
        if (item.name) names.add(item.name);
      });
    }
    
    return Array.from(names);
  }, [data]);

  // Color palette for different series
  const colors = [
    "#000000",
    "#FF0000",
    "#0000FF",
    "#00FF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
  ];

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Calculate max value for Y-axis
  const maxValue = Math.max(
    ...chartData.flatMap((d: GroupedChartData) =>
      seriesNames.map((name) => {
        const value = d[name];
        return typeof value === "number" ? value : 0;
      })
    ),
    1
  );
  const yAxisMax = Math.ceil(maxValue * 1.1);

  return (
    <div className="w-full h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E5E5"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, yAxisMax]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [
              typeof value === "number" ? value.toFixed(2) : value,
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            iconType="line"
          />
          {seriesNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
