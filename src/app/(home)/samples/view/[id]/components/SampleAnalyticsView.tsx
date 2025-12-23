"use client";
import React, { useState, useEffect } from "react";
import { Sample } from "@/types";
import { getSampleAnalysisGroupsAnalyticsService } from "@/app/actions";
import { CustomTabs } from "@/components/custom-tabs";
import { Text } from "@/components";
import { SampleAnalyticsChart } from "./SampleAnalyticsChart";
// import { SampleAnalyticsTable } from "./SampleAnalyticsTable";

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

// Map UI category names to API category names
const CATEGORY_API_MAP: Record<string, string> = {
  "Wear Metals": "Wear Metals",
  Contaminants: "Contaminant",
  "Additives & Lubricant Conditions": "Additive",
  Viscosity: "Viscosity",
  "Cummulative Particle Count/ml": "Particle Count",
};

const PERIOD_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

interface SampleAnalyticsViewProps {
  sample: Sample;
}

export function SampleAnalyticsView({ sample }: SampleAnalyticsViewProps) {
  const [activeCategory, setActiveCategory] = useState("Wear Metals");
  const [selectedPeriod, setSelectedPeriod] = useState("90");
  const [chartData, setChartData] = useState<AnalyticsDataPoint[]>([]);
  const [, setTableData] = useState<AnalyticsDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElement, setSelectedElement] =
    useState<string>("All Elements");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Map UI category to API category
        const apiCategory = CATEGORY_API_MAP[activeCategory] || activeCategory;
        const periodParam = selectedPeriod
          ? parseInt(selectedPeriod)
          : undefined;

        console.log("apiCategory", apiCategory);

        const response = await getSampleAnalysisGroupsAnalyticsService(
          apiCategory,
          periodParam
        );

        console.log("response", response);
        if (response.success && response.data) {
          // Process the new API response structure
          // Expected structure: { labels: string[], datasets: [{ label: string, data: number[] }] }
          const responseData = response.data?.data as {
            labels?: string[];
            datasets?: Array<{ label: string; data: number[] }>;
          };

          let chartData: AnalyticsDataPoint[] = [];
          let tableData: AnalyticsDataPoint[] = [];

          if (
            responseData?.labels &&
            Array.isArray(responseData.labels) &&
            responseData?.datasets &&
            Array.isArray(responseData.datasets)
          ) {
            // Transform labels and datasets into chart/table format
            // Format: [{ date: "2025-11-02", "sodium": 10.5, "potassium": 5.2, ... }, ...]
            chartData = responseData.labels.map((label, index) => {
              const dataPoint: AnalyticsDataPoint = {
                date: label,
                label: label,
              };

              // Add each dataset's value for this label index as properties
              responseData.datasets?.forEach((dataset) => {
                if (dataset.data && dataset.data[index] !== undefined) {
                  // Use dataset.label as the property key (e.g., "sodium", "potassium")
                  dataPoint[dataset.label] = dataset.data[index];
                }
              });

              return dataPoint;
            });

            // Use same format for table (grouped by date with columns for each dataset)
            tableData = chartData;
          } else {
            // Fallback for other response structures
            chartData = [];
            tableData = [];
          }

          setChartData(chartData);
          setTableData(tableData);
        } else {
          setChartData([]);
          setTableData([]);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setChartData([]);
        setTableData([]);
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
              {selectedPeriod === "90"
                ? "90 days"
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
      {/* <div className="border border-gray-100">
        <SampleAnalyticsTable
          data={tableData}
          category={activeCategory}
          isLoading={isLoading}
        />
      </div> */}
    </div>
  );
}
