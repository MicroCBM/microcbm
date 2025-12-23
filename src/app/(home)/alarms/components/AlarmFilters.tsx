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

export function AlarmFilters() {
  const [filters, setFilters] = useState({
    search: "",
    parameter: "",
    acknowledged_status: "",
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: event.target.value });
  };

  const handleParameterChange = (value: string) => {
    setFilters({ ...filters, parameter: value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, acknowledged_status: value });
  };

  return (
    <div className="flex items-center gap-2">
      <Search
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search alarms"
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
            Parameter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleParameterChange("Temperature")}
            >
              <Text variant="span">Temperature</Text>
            </button>
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleParameterChange("Pressure")}
            >
              <Text variant="span">Pressure</Text>
            </button>
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleParameterChange("Vibration")}
            >
              <Text variant="span">Vibration</Text>
            </button>
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleParameterChange("Flow")}
            >
              <Text variant="span">Flow</Text>
            </button>
          </div>
        </PopoverContent>
      </Popover>

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
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleStatusChange("acknowledged")}
            >
              <Text variant="span">Acknowledged</Text>
            </button>
            <button
              className="px-2 py-[6px] hover:bg-gray-100 text-left"
              onClick={() => handleStatusChange("unacknowledged")}
            >
              <Text variant="span">Unacknowledged</Text>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
