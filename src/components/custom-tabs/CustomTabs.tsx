"use client";

import React from "react";
import { cn } from "@/libs";

interface TabItem {
  value: string;
  label: string;
}

interface CustomTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: TabItem[];
  className?: string;
}

export function CustomTabs({
  value,
  onValueChange,
  tabs,
  className,
}: CustomTabsProps) {
  return (
    <div className={cn("items-center bg-gray-50 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all duration-200",
            "hover:bg-white hover:shadow-sm",
            value === tab.value
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
