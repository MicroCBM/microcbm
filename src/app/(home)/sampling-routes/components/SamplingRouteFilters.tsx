"use client";
import React from "react";
import { Search } from "@/components";

export function SamplingRouteFilters() {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Search
          placeholder="Search sampling routes..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
    </div>
  );
}
