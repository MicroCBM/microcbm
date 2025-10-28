"use client";

import React from "react";
import { Icon } from "@/libs";
import { Text } from "@/components";
import { cn } from "@/libs";

interface SeverityLevel {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

interface Recommendation {
  text: string;
  author: string;
  role: string;
}

interface SeverityCardData {
  title: string;
  subtitle: string;
  date: string;
  severityLevels: SeverityLevel[];
  recommendation: Recommendation;
}

interface SeverityCardProps {
  data: SeverityCardData;
  className?: string;
}

export function SeverityCard({ data, className }: SeverityCardProps) {
  return (
    <div className={cn("border border-gray-200 p-6", className)}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Text variant="h6" className="font-semibold text-gray-900 mb-1">
            {data.title}
          </Text>
          <Text variant="span" className="text-sm text-gray-500">
            {data.subtitle}
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200">
            <Icon icon="mdi:download" className="w-4 h-4" />
            Export
          </button>
          <div className="relative">
            <input
              type="date"
              className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              defaultValue="2024-05-12"
            />
            <Icon
              icon="mdi:calendar"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Severity Levels */}
      <div className="space-y-4 mb-6">
        {data.severityLevels.map((level) => (
          <div key={level.value} className="flex items-center justify-between">
            <Text variant="span" className="text-sm text-gray-700 min-w-[80px]">
              {level.label}
            </Text>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(level.value / 15) * 100}%`,
                    backgroundColor: level.color,
                  }}
                />
              </div>
            </div>
            <Text
              variant="span"
              className="text-sm font-medium text-gray-900 min-w-[30px] text-right"
            >
              {level.value}
            </Text>
          </div>
        ))}
      </div>

      {/* Recommendation Section */}
      <div className="bg-gray-50 p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="h6">Recommendation</Text>
          <Text
            variant="span"
            className="text-sm text-gray leading-relaxed block"
          >
            {data.recommendation.text}
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <Text variant="span" className="font-medium text-gray-900">
            {data.recommendation.author}
          </Text>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            {data.recommendation.role}
          </span>
        </div>
      </div>
    </div>
  );
}
