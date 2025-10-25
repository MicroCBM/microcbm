"use client";
import {
  CustomTabs,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  AreaChart,
} from "@/components";
import React from "react";

const timeTabs = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
];

export default function LineChart() {
  const [tabs, setTabs] = React.useState<
    "last-7-days" | "last-30-days" | "last-90-days"
  >("last-7-days");

  const generateChartData = () => {
    const data = [];
    const startDate = new Date("2024-04-03");

    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Generate oscillating pattern with increasing amplitude
      const baseValue1 = 2 + Math.sin(i * 0.3) * 8 + Math.random() * 2;
      const baseValue2 = 5 + Math.sin(i * 0.25 + 1) * 12 + Math.random() * 3;

      data.push({
        date: date.toISOString(),
        series1: Math.max(0, baseValue1),
        series2: Math.max(0, baseValue2),
      });
    }

    return data;
  };

  return (
    <>
      {/* chart section */}
      <section className="py-[12.8px] px-[19.8px] border border-gray-100 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Select defaultValue="wear-metals">
            <SelectTrigger>
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wear-metals">Wear Metals</SelectItem>
              <SelectItem value="contaminants">Contamination</SelectItem>
              <SelectItem value="additives-and-lubricants">
                Additives & Lubricants
              </SelectItem>
            </SelectContent>
          </Select>
          <CustomTabs
            value={tabs}
            onValueChange={(value) => setTabs(value as typeof tabs)}
            tabs={timeTabs}
          />
        </div>
        <AreaChart data={generateChartData()} />
      </section>
    </>
  );
}
