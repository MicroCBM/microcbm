"use client";
import React, { useState, useEffect } from "react";
import { Sample, Asset, SamplingPoint } from "@/types";
import {
  getSampleAnalysisGroupsAnalyticsService,
  getAssetService,
  getSamplingPointService,
} from "@/app/actions";
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
  { value: "3", label: "Last 3 months" },
  { value: "6", label: "Last 6 months" },
  { value: "9", label: "Last 9 months" },
  { value: "12", label: "Last 12 months" },
];

interface SampleAnalyticsViewProps {
  sample: Sample;
}

export function SampleAnalyticsView({ sample }: SampleAnalyticsViewProps) {
  const [activeCategory, setActiveCategory] = useState("Wear Metals");
  const [selectedPeriod, setSelectedPeriod] = useState("12");
  const [chartData, setChartData] = useState<AnalyticsDataPoint[]>([]);
  const [, setTableData] = useState<AnalyticsDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElement, setSelectedElement] =
    useState<string>("All Elements");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [samplingPoint, setSamplingPoint] = useState<SamplingPoint | null>(
    null
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // Fetch asset and sampling point details
  useEffect(() => {
    if (sample) {
      setIsLoadingDetails(true);
      const fetchDetails = async () => {
        try {
          const [assetData, samplingPointData] = await Promise.all([
            sample.asset?.id
              ? getAssetService(sample.asset.id)
              : Promise.resolve(null),
            sample.sampling_point?.id
              ? getSamplingPointService(sample.sampling_point.id)
              : Promise.resolve(null),
          ]);

          setAsset(assetData);
          setSamplingPoint(samplingPointData);
        } catch (error) {
          console.error("Failed to fetch sample details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchDetails();
    }
  }, [sample]);

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
          // Handle nested data structure (response.data.data.data)
          const nestedData = response.data?.data;
          const responseData = (nestedData?.data ||
            nestedData ||
            response.data?.data) as {
            labels?: string[];
            datasets?: Array<{ label: string; data: number[] }>;
            data?: number[];
          };

          let chartData: AnalyticsDataPoint[] = [];
          let tableData: AnalyticsDataPoint[] = [];

          // Check if we have the datasets format (time-series data)
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

            tableData = chartData;
          }
          // Check if we have the simple format (aggregated data: labels + data arrays)
          else if (
            responseData?.labels &&
            Array.isArray(responseData.labels) &&
            responseData?.data &&
            Array.isArray(responseData.data) &&
            responseData.labels.length === responseData.data.length
          ) {
            // This is aggregated data format (like Contaminants)
            // Create a single data point with all elements as properties
            const dataPoint: AnalyticsDataPoint = {
              date: new Date().toISOString().split("T")[0],
              label: "Current",
            };

            responseData.labels.forEach((label, index) => {
              if (responseData.data && responseData.data[index] !== undefined) {
                dataPoint[label] = responseData.data[index];
              }
            });

            chartData = [dataPoint];
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
        // Check for element/name fields
        if (item.element && typeof item.element === "string") {
          uniqueElements.add(item.element);
        }
        if (item.name && typeof item.name === "string") {
          uniqueElements.add(item.name);
        }
        // Also check for properties that are numeric (these are element names in aggregated format)
        Object.keys(item).forEach((key) => {
          if (
            key !== "date" &&
            key !== "timestamp" &&
            key !== "element" &&
            key !== "name" &&
            key !== "value" &&
            key !== "count" &&
            key !== "label" &&
            key !== "created_at_datetime" &&
            key !== "date_sampled" &&
            typeof item[key] === "number"
          ) {
            uniqueElements.add(key);
          }
        });
      }
    });
    return ["All Elements", ...Array.from(uniqueElements)];
  }, [chartData]);

  // Filter chart data based on selected element (client-side filtering)
  const filteredChartData = React.useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) return [];
    if (selectedElement === "All Elements") return chartData;

    // For aggregated format (like Contaminants), filter by property name
    // Check if data is in aggregated format (has element names as properties)
    const firstItem = chartData[0];
    const isAggregatedFormat =
      firstItem &&
      typeof firstItem === "object" &&
      selectedElement in firstItem &&
      typeof firstItem[selectedElement] === "number";

    if (isAggregatedFormat) {
      // Create filtered data points with only the selected element
      return chartData.map((item: AnalyticsDataPoint) => {
        const filteredItem: AnalyticsDataPoint = {
          date: item.date,
          label: item.label,
          timestamp: item.timestamp,
        };
        // Only include the selected element's value
        if (
          selectedElement in item &&
          typeof item[selectedElement] === "number"
        ) {
          filteredItem[selectedElement] = item[selectedElement];
        }
        return filteredItem;
      });
    }

    // For time-series format, filter by element/name fields or property keys
    return chartData
      .map((item: AnalyticsDataPoint) => {
        // Check if this item has the selected element
        if (
          item &&
          typeof item === "object" &&
          (item.element === selectedElement ||
            item.name === selectedElement ||
            (selectedElement in item &&
              typeof item[selectedElement] === "number"))
        ) {
          // If it's a property-based format, create a filtered version
          if (
            selectedElement in item &&
            typeof item[selectedElement] === "number"
          ) {
            const filteredItem: AnalyticsDataPoint = {
              date: item.date,
              label: item.label,
              timestamp: item.timestamp,
              [selectedElement]: item[selectedElement],
            };
            return filteredItem;
          }
          // Otherwise return as-is (element/name field format)
          return item;
        }
        return null;
      })
      .filter((item): item is AnalyticsDataPoint => item !== null);
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
        {/* Asset and Sampling Point Info */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {asset && (
              <div className="flex items-center gap-2">
                <Text variant="span" className="text-gray-600 font-medium">
                  Asset:
                </Text>
                <Text variant="span" className="text-gray-900">
                  {asset.name || "N/A"}
                </Text>
                {asset.tag && (
                  <>
                    <Text variant="span" className="text-gray-400">
                      •
                    </Text>
                    <Text variant="span" className="text-gray-600 font-medium">
                      Tag:
                    </Text>
                    <Text variant="span" className="text-gray-900">
                      {asset.tag}
                    </Text>
                  </>
                )}
              </div>
            )}
            {samplingPoint && (
              <div className="flex items-center gap-2">
                {asset && (
                  <Text variant="span" className="text-gray-400">
                    •
                  </Text>
                )}
                <Text variant="span" className="text-gray-600 font-medium">
                  Sampling Point:
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.name || "N/A"}
                </Text>
              </div>
            )}
            {isLoadingDetails && (
              <Text variant="span" className="text-gray-500 text-sm">
                Loading details...
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <Text variant="h6" className="text-gray-900">
              Particle Quantifier Index
            </Text>
            <Text variant="p" className="text-sm text-gray-500">
              Total for the last{" "}
              {selectedPeriod === "12"
                ? "12 months"
                : selectedPeriod === "9"
                ? "9 months"
                : selectedPeriod === "6"
                ? "6 months"
                : "3 months"}
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
