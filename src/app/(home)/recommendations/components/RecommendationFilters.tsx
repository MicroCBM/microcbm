"use client";

import React from "react";
import { Button, Text, Search } from "@/components";
import { Icon } from "@/libs";
import { RecommendationFilters } from "@/types";

interface RecommendationFiltersProps {
  filters: RecommendationFilters;
  onFiltersChange: (filters: RecommendationFilters) => void;
  onClearFilters: () => void;
  sites: any[];
  assets: any[];
  recommenders: any[];
}

export function RecommendationFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  sites,
  assets,
  recommenders,
}: RecommendationFiltersProps) {
  const handleFilterChange = (
    key: keyof RecommendationFilters,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value.trim() !== ""
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Text variant="h6" className="text-gray-900">
          Filters
        </Text>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="small"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <Icon icon="mdi:close" className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Search
            placeholder="Search recommendations..."
            value={filters.search || ""}
            onChange={(value) => handleFilterChange("search", value)}
          />
        </div>

        <div>
          <select
            value={filters.severity || ""}
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
            value={filters.site || ""}
            onChange={(e) => handleFilterChange("site", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.status || ""}
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
