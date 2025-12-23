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
import { INDUSTRIES, TEAM_SIZES } from "@/helpers/common";

export function OrganizationFilters() {
  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    team_strength: "",
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: event.target.value });
  };

  // const handleIndustryChange = (value: string) => {
  //   setFilters({ ...filters, industry: value });
  // };

  // const handleTeamStrengthChange = (value: string) => {
  //   setFilters({ ...filters, team_strength: value });
  // };

  return (
    <div className="flex items-center gap-2">
      <Search
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search organizations"
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
            Industry
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
              >
                <Text variant="span">{industry}</Text>
              </button>
            ))}
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
            Team Size
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {TEAM_SIZES.map((teamSize) => (
              <button
                key={teamSize}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
              >
                <Text variant="span">{teamSize}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
