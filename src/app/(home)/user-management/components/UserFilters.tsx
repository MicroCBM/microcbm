import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Search,
  Text,
} from "@/components";
import { Icon } from "@/libs";
import { ROLES, STATUSES } from "@/utils";
import { Sites } from "@/types";
import React from "react";

export function UserFilters({ sites }: { sites: Sites[] }) {
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex items-center gap-2">
      <Search
        value={search}
        onChange={setSearch}
        placeholder="Search users"
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
            Role
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[208px]">
          <div className="flex flex-col">
            {ROLES.map((role) => (
              <button
                key={role.value}
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
              >
                <Text variant="span">{role.label}</Text>
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
            Site Assigned
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
