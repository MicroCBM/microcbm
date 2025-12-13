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
import React, { useEffect, useState } from "react";
import { getSampleAnalysisGroupsAnalyticsService } from "@/app/actions";
import { Sample } from "@/types";

const timeTabs = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
];

const categoryMap: Record<string, string> = {
  "wear-metals": "Wear Metals",
  "contaminants": "Contaminants",
  "additives-and-lubricants": "Additives & Lubricant Conditions",
};

const periodMap: Record<string, number> = {
  "last-7-days": 7,
  "last-30-days": 30,
  "last-90-days": 90,
};

interface LineChartProps {
  samples?: Sample[];
}

export default function LineChart({ samples = [] }: LineChartProps) {
  const [tabs, setTabs] = React.useState<
    "last-7-days" | "last-30-days" | "last-90-days"
  >("last-7-days");
  const [selectedCategory, setSelectedCategory] = React.useState("wear-metals");
  const [chartData, setChartData] = useState<Array<{ date: string; series1: number; series2: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      if (samples.length === 0) {
        // Generate fallback data if no samples
        const data = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodMap[tabs]);

        for (let i = 0; i < periodMap[tabs]; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          data.push({
            date: date.toISOString(),
            series1: 0,
            series2: 0,
          });
        }
        setChartData(data);
        return;
      }

      setIsLoading(true);
      try {
        const category = categoryMap[selectedCategory] || "Wear Metals";
        const period = periodMap[tabs];

        const response = await getSampleAnalysisGroupsAnalyticsService(
          category,
          period
        );

        if (response.success && response.data) {
          const responseData = response.data?.data as {
            labels?: string[];
            datasets?: Array<{ label: string; data: number[] }>;
          };

          if (responseData?.labels && responseData?.datasets) {
            const labels = responseData.labels;
            const datasets = responseData.datasets;

            // Transform API data to chart format
            const transformedData = labels.map((label, index) => ({
              date: label,
              series1: datasets[0]?.data[index] || 0,
              series2: datasets[1]?.data[index] || 0,
            }));

            setChartData(transformedData);
          } else {
            // Fallback: generate data from samples
            generateDataFromSamples();
          }
        } else {
          generateDataFromSamples();
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        generateDataFromSamples();
      } finally {
        setIsLoading(false);
      }
    };

    const generateDataFromSamples = () => {
      // Generate chart data from samples based on date_sampled
      const data: Record<string, { series1: number; series2: number; count: number }> = {};
      
      samples.forEach((sample) => {
        if (sample.date_sampled) {
          const date = new Date(sample.date_sampled * 1000);
          const dateKey = date.toISOString().split("T")[0];
          
          if (!data[dateKey]) {
            data[dateKey] = { series1: 0, series2: 0, count: 0 };
          }
          
          // Aggregate based on category
          if (selectedCategory === "wear-metals" && sample.wear_metals) {
            const values = sample.wear_metals.map((wm) => wm.value || 0);
            data[dateKey].series1 += values.reduce((a, b) => a + b, 0) / (values.length || 1);
          } else if (selectedCategory === "contaminants" && sample.contaminants) {
            const values = sample.contaminants.map((c) => c.value || 0);
            data[dateKey].series2 += values.reduce((a, b) => a + b, 0) / (values.length || 1);
          }
          
          data[dateKey].count++;
        }
      });

      // Convert to array and fill gaps
      const sortedDates = Object.keys(data).sort();
      const result = sortedDates.map((date) => ({
        date: new Date(date).toISOString(),
        series1: data[date].series1 / Math.max(data[date].count, 1),
        series2: data[date].series2 / Math.max(data[date].count, 1),
      }));

      setChartData(result.length > 0 ? result : generateFallbackData());
    };

    const generateFallbackData = () => {
      const data = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodMap[tabs]);

      for (let i = 0; i < periodMap[tabs]; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        data.push({
          date: date.toISOString(),
          series1: 0,
          series2: 0,
        });
      }
      return data;
    };

    fetchChartData();
  }, [tabs, selectedCategory, samples]);

  return (
    <>
      {/* chart section */}
      <section className="py-[12.8px] px-[19.8px] border border-gray-100 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
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
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <AreaChart data={chartData} />
        )}
      </section>
    </>
  );
}
