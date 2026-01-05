"use client";

import countryRegionData from "@/data/country-region.data.json";
import { useMemo } from "react";

import { filterRegions } from "@/utils";

import { CountryRegion } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../select";
import { Label } from "../label";

interface RegionSelectProps {
  country?: string;
  priorityOptions?: string[];
  whitelist?: string[];
  blacklist?: string[];
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: string | boolean;
  value?: string;
  label?: string;
}

function RegionSelect({
  country,
  priorityOptions = [],
  whitelist = [],
  blacklist = [],
  onChange = () => {},
  className,
  placeholder = "Region/State",
  error,
  value,
  label,
}: RegionSelectProps) {
  // Memoize regions to prevent unnecessary re-renders
  const regions = useMemo(() => {
    if (!country) {
      return [];
    }

    const countryData = (countryRegionData as CountryRegion[]).find(
      (c) => c.countryShortCode === country
    );

    if (countryData && countryData.regions) {
      return filterRegions(
        countryData.regions,
        priorityOptions,
        whitelist,
        blacklist
      );
    }

    return [];
  }, [country, priorityOptions, whitelist, blacklist]);

  return (
    <div className="flex flex-col gap-[6px]">
      {label ? <Label className="font-normal">{label}</Label> : null}
      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={!country || regions.length === 0}
      >
        <SelectTrigger className={className} error={error}>
          <SelectValue
            placeholder={
              !country
                ? "Select a country first"
                : regions.length === 0
                ? "No regions available"
                : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.shortCode} value={region.shortCode}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default RegionSelect;

