"use client";
import React from "react";
import { Icon } from "@/libs";

interface TableDataPoint {
  element?: string;
  name?: string;
  value?: number;
  unit?: string;
  date?: string;
  [key: string]: any;
}

interface SampleAnalyticsTableProps {
  data: TableDataPoint[];
  category: string;
  isLoading: boolean;
}

export function SampleAnalyticsTable({
  data,
  category,
  isLoading,
}: SampleAnalyticsTableProps) {
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading table data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Extract column names based on category
  const columns = React.useMemo(() => {
    if (category === "Wear Metals") {
      return [
        "Sodium",
        "Iron",
        "Chromium",
        "Lead",
        "Titanium",
        "PQ Index",
        "Nickel",
        "Aluminium",
        "Tin",
        "Silver",
      ];
    } else if (category === "Contaminants") {
      return ["Water", "Fuel", "Coolant", "Soot"];
    } else if (category === "Additives & Lubricant Conditions") {
      return ["TBN", "TAN", "Oxidation", "Nitration"];
    } else if (category === "Viscosity") {
      return ["Viscosity @ 40°C", "Viscosity @ 100°C", "VI"];
    } else if (category === "Cummulative Particle Count/ml") {
      return ["4μm", "6μm", "14μm", "21μm"];
    }
    // Fallback: extract from data
    const columnSet = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (
          key !== "date" &&
          key !== "timestamp" &&
          key !== "id" &&
          key !== "element" &&
          key !== "name"
        ) {
          columnSet.add(key);
        }
      });
    });
    return Array.from(columnSet);
  }, [data, category]);

  // Transform data into rows
  const tableRows = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // If data is an array of objects with element/value structure
    if (data[0]?.element || data[0]?.name) {
      // Create a single row with all elements
      const row: Record<string, any> = { date: "TODAY" };
      data.forEach((item: any) => {
        const key = item.element || item.name;
        if (key) {
          row[key] = item.value || item.count || "-";
        }
      });
      return [row];
    }

    // Otherwise, use data as-is
    return data.map((item, index) => ({
      ...item,
      date: item.date || (index === 0 ? "TODAY" : `Row ${index + 1}`),
    }));
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Date
            </th>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {row.date || (rowIndex === 0 ? "TODAY" : `Row ${rowIndex + 1}`)}
              </td>
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 text-sm text-gray-900">
                  {typeof row[column] === "number"
                    ? row[column].toFixed(2)
                    : row[column] || "-"}
                </td>
              ))}
              <td className="px-4 py-3 text-sm">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Icon
                    icon="mdi:dots-vertical"
                    className="w-5 h-5 text-gray-600"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

