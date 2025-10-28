"use client";

import React from "react";
import { Text, Search } from "@/components";

export function RecommendationFilters() {
  const [search, setSearch] = React.useState("");
  const handleFilterChange = (key: string, value: string) => {
    console.log(key, value);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Text variant="h6" className="text-gray-900">
          Filters
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Search
            placeholder="Search recommendations..."
            value={search}
            onChange={(value) => setSearch(value)}
          />
        </div>

        <div>
          <select
            onChange={(e) => handleFilterChange("severity", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <select
            onChange={(e) => handleFilterChange("site", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sites</option>
          </select>
        </div>

        <div>
          <select
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
    </div>
  );
}
