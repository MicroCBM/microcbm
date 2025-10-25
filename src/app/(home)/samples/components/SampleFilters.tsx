"use client";
import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Search,
  Text,
} from "@/components";
import { Icon } from "@/libs";

const SEVERITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "urgent", label: "Urgent" },
];

export function SampleFilters() {
  const [filters, setFilters] = useState({
    search: "",
    severity: "",
  });

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleSeverityChange = (value: string) => {
    setFilters({ ...filters, severity: value });
  };

  return (
    <div className="flex items-center gap-2">
      <Search
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search samples"
        className="h-10 max-w-[296px]"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="medium"
            className="border border-gray-100 group"
          >
            <Icon
              icon="hugeicons:plus-sign-circle"
              className="text-black size-4 group-hover:text-white"
            />
            Severity
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {SEVERITY_OPTIONS.map((severity) => (
              <button
                key={severity.value}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => handleSeverityChange(severity.value)}
              >
                <Text variant="span">{severity.label}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
