"use client";
import React, { useState, useEffect } from "react";
import { Sample } from "@/types";
import {
  getSampleContaminantsAnalyticsService,
  getSampleAnalysisGroupsAnalyticsService,
} from "@/app/actions";
import { CustomTabs } from "@/components/custom-tabs";
import { Text } from "@/components";
import { SampleAnalyticsChart } from "./SampleAnalyticsChart";
import { SampleAnalyticsTable } from "./SampleAnalyticsTable";

interface AnalyticsDataPoint {
  name?: string;
  element?: string;
  value?: number;
  count?: number;
  date?: string;
  timestamp?: number;
  label?: string;
  [key: string]: unknown;
}

interface NestedAnalyticsData {
  data?: number[] | AnalyticsDataPoint[];
  labels?: string[];
  series?: AnalyticsDataPoint[];
  values?: AnalyticsDataPoint[];
  items?: AnalyticsDataPoint[];
  results?: AnalyticsDataPoint[];
  [key: string]: unknown;
}

const CATEGORIES = [
  { value: "Wear Metals", label: "Wear Metals" },
  { value: "Contaminants", label: "Contaminants" },
  {
    value: "Additives & Lubricant Conditions",
    label: "Additives & Lubricant Conditions",
  },
  { value: "Viscosity", label: "Viscosity" },
  {
    value: "Cummulative Particle Count/ml",
    label: "Cummulative Particle Count/ml",
  },
];

const PERIOD_OPTIONS = [
  { value: "3", label: "Last 3 months" },
  { value: "30", label: "Last 30 days" },
  { value: "7", label: "Last 7 days" },
];

interface SampleAnalyticsViewProps {
  sample: Sample;
}

export function SampleAnalyticsView({ sample }: SampleAnalyticsViewProps) {
  const [activeCategory, setActiveCategory] = useState("Wear Metals");
  const [selectedPeriod, setSelectedPeriod] = useState("3");
  const [chartData, setChartData] = useState<AnalyticsDataPoint[]>([]);
  const [tableData, setTableData] = useState<AnalyticsDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElement, setSelectedElement] =
    useState<string>("All Elements");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        let response;
        if (activeCategory === "Contaminants") {
          response = await getSampleContaminantsAnalyticsService(
            parseInt(selectedPeriod)
          );
          console.log("response in contaminants analytics", response);
        } else {
          const periodParam = selectedPeriod
            ? parseInt(selectedPeriod)
            : undefined;
          response = await getSampleAnalysisGroupsAnalyticsService(
            activeCategory,
            periodParam
          );
        }

        if (response.success && response.data) {
          // Process the data based on the API response structure
          let data: AnalyticsDataPoint[] = [];

          // Handle nested structure: response.data.data.data and response.data.data.labels
          const nestedData = response.data?.data as
            | NestedAnalyticsData
            | AnalyticsDataPoint[]
            | unknown;

          if (
            nestedData &&
            typeof nestedData === "object" &&
            !Array.isArray(nestedData)
          ) {
            const typedNestedData = nestedData as NestedAnalyticsData;

            if (typedNestedData.data && Array.isArray(typedNestedData.data)) {
              // If we have labels and data arrays, combine them
              if (
                typedNestedData.labels &&
                Array.isArray(typedNestedData.labels)
              ) {
                // Check if data is array of numbers (for labels mapping)
                if (
                  typedNestedData.data.length > 0 &&
                  typeof typedNestedData.data[0] === "number"
                ) {
                  data = (typedNestedData.data as number[]).map(
                    (value: number, index: number) => ({
                      name: typedNestedData.labels?.[index] || "",
                      element: typedNestedData.labels?.[index] || "",
                      value: value,
                      label: typedNestedData.labels?.[index] || "",
                    })
                  );
                } else {
                  // Data is already array of objects
                  data = typedNestedData.data as AnalyticsDataPoint[];
                }
              } else {
                // Just use the data array (might be numbers or objects)
                if (
                  typedNestedData.data.length > 0 &&
                  typeof typedNestedData.data[0] === "number"
                ) {
                  // Convert numbers to objects
                  data = (typedNestedData.data as number[]).map(
                    (value: number) => ({
                      value: value,
                    })
                  );
                } else {
                  data = typedNestedData.data as AnalyticsDataPoint[];
                }
              }
            } else if (
              typedNestedData.series &&
              Array.isArray(typedNestedData.series)
            ) {
              data = typedNestedData.series;
            } else if (
              typedNestedData.values &&
              Array.isArray(typedNestedData.values)
            ) {
              data = typedNestedData.values;
            } else if (
              typedNestedData.items &&
              Array.isArray(typedNestedData.items)
            ) {
              data = typedNestedData.items;
            } else if (
              typedNestedData.results &&
              Array.isArray(typedNestedData.results)
            ) {
              data = typedNestedData.results;
            }
          } else if (Array.isArray(nestedData)) {
            // Direct array response
            data = nestedData as AnalyticsDataPoint[];
          } else if (Array.isArray(response.data)) {
            // Fallback: response.data is directly an array
            data = response.data as AnalyticsDataPoint[];
          }

          setChartData(data);
          setTableData(data);
        } else {
          setChartData([]);
          setTableData([]);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [activeCategory, selectedPeriod]);

  // Extract unique elements from data for filter
  const elements = React.useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) {
      return ["All Elements"];
    }
    const uniqueElements = new Set<string>();
    chartData.forEach((item: AnalyticsDataPoint) => {
      if (item && typeof item === "object") {
        if (item.element && typeof item.element === "string") {
          uniqueElements.add(item.element);
        }
        if (item.name && typeof item.name === "string") {
          uniqueElements.add(item.name);
        }
      }
    });
    return ["All Elements", ...Array.from(uniqueElements)];
  }, [chartData]);

  // Filter chart data based on selected element
  const filteredChartData = React.useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    if (selectedElement === "All Elements") return chartData;
    return chartData.filter(
      (item: AnalyticsDataPoint) =>
        item &&
        typeof item === "object" &&
        (item.element === selectedElement || item.name === selectedElement)
    );
  }, [chartData, selectedElement]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with ID */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Recents</span>
        </div>
        <div>
          <Text variant="h4" className="text-gray-900">
            {sample.serial_number}
          </Text>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <CustomTabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          tabs={CATEGORIES}
          className="flex gap-0"
        />
      </div>

      {/* Chart Section */}
      <div className="border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text variant="h6" className="text-gray-900">
              Particle Quantifier Index
            </Text>
            <Text variant="p" className="text-sm text-gray-500">
              Total for the last{" "}
              {selectedPeriod === "3"
                ? "3 months"
                : selectedPeriod === "30"
                ? "30 days"
                : "7 days"}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            {/* Element Filter */}
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {elements.map((element) => (
                <option key={element} value={element}>
                  {element}
                </option>
              ))}
            </select>
            {/* Period Filter */}
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  selectedPeriod === option.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        ) : (
          <SampleAnalyticsChart
            data={filteredChartData}
            category={activeCategory}
          />
        )}
      </div>

      {/* Table Section */}
      <div className="border border-gray-100">
        <SampleAnalyticsTable
          data={tableData}
          category={activeCategory}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
