"use client";

import countryRegionData from "@/data/country-region.data.json";
import { useEffect, useState } from "react";

import { filterCountries } from "@/utils";

import { CountryRegion } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../select";
import { Label } from "../label";

interface CountrySelectProps {
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

function CountrySelect({
  priorityOptions = [],
  whitelist = [],
  blacklist = [],
  onChange = () => {},
  className,
  placeholder = "Country",
  error,
  value,
  label,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<CountryRegion[]>([]);

  useEffect(() => {
    setCountries(
      filterCountries(
        countryRegionData as CountryRegion[],
        priorityOptions,
        whitelist,
        blacklist
      )
    );
  }, [priorityOptions, whitelist, blacklist]);

  return (
    <div className="flex flex-col gap-[6px]">
      {label ? <Label className="font-normal">{label}</Label> : null}
      <Select
        value={value}
        onValueChange={(value: string) => {
          onChange(value);
        }}
      >
        <SelectTrigger className={className} error={error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {countries.map(({ countryName, countryShortCode }) => (
            <SelectItem key={countryShortCode} value={countryShortCode}>
              {countryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CountrySelect;
