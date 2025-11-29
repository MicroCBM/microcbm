import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Search,
  Text,
} from "@/components";
import { Icon } from "@/libs";
import { Organization, Sites } from "@/types";
import { STATUSES } from "@/utils";
import React from "react";

export function SiteFilters({
  organizations,
  sites,
}: {
  organizations: Organization[];
  sites: Sites[];
}) {
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex items-center gap-2">
      <Search
        value={search}
        onChange={setSearch}
        placeholder="Search sites"
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
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {STATUSES.map((status) => (
              <button
                key={status.value}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
              >
                <Text variant="span">{status.label}</Text>
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
            Organization
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {organizations.map((org) => (
              <button
                key={org.id}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
              >
                <Text variant="span">{org.name}</Text>
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
            Site
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {sites.map((site) => (
              <button
                key={site.id}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
              >
                <Text variant="span">{site.name}</Text>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
