"use client";
import React, { useState } from "react";
import { Search } from "@/components";

export function DepartmentFilters() {
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Search
          placeholder="Search departments..."
          value={search}
          onChange={handleSearchChange}
          className="h-10 max-w-[296px]"
        />
      </div>
    </div>
  );
}
