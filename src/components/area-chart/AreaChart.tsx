"use client";

import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ChartData {
  date: string;
  series1: number;
  series2: number;
}

interface AreaChartProps {
  data: ChartData[];
  className?: string;
}

export function AreaChart({ data, className }: AreaChartProps) {
  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="series1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#A0A0A0" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="series2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D0D0D0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#D0D0D0" stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 30]}
            ticks={[0, 10, 20, 30]}
            tickFormatter={(value) => `${value}ppm`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
            }}
            formatter={(value, name) => [
              typeof value === "number" && !Number.isNaN(value)
                ? `${value.toFixed(1)}ppm`
                : `${value ?? "—"}ppm`,
              String(name ?? "") === "series1" ? "Series 1" : "Series 2",
            ]}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            }}
          />
          <Area
            type="monotone"
            dataKey="series1"
            stroke="#000"
            strokeWidth={1}
            fill="url(#series1)"
            dot={false}
            activeDot={{ r: 4, fill: "#000" }}
          />
          <Area
            type="monotone"
            dataKey="series2"
            stroke="#000"
            strokeWidth={1}
            fill="url(#series2)"
            dot={false}
            activeDot={{ r: 4, fill: "#000" }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
