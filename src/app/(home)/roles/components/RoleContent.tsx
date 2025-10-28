"use client";
import React, { useState } from "react";
import {
  Text,
  Button,
  Search,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components";
import { cn, Icon } from "@/libs";
import { AddRoleModal } from "./AddRoleModal";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

export function RoleContent({
  permissionsData,
}: {
  permissionsData: Permission[];
}) {
  console.log("permissionsData", permissionsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [tab, setTab] = useState("roles");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text variant="h6">Roles & Permissions</Text>
        <AddRoleModal permissionsData={permissionsData} />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-[1px] w-fit">
        <button
          onClick={() => setTab("roles")}
          className={cn(
            "px-4 py-2 text-sm font-medium text-gray-900 bg-white shadow-sm",
            tab === "roles" && "bg-gray-100"
          )}
        >
          Roles
        </button>
        <button
          onClick={() => setTab("permissions")}
          className={cn(
            "px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700",
            tab === "permissions" && "bg-gray-100"
          )}
        >
          Permissions
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Search
            placeholder="Search roles"
            value={searchTerm}
            onChange={setSearchTerm}
            className="h-10 max-w-[296px]"
          />
        </div>
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
              Level
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[208px]">
            <div className="flex flex-col">
              <button
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => setStatusFilter("level_1")}
              >
                <Text variant="span">Level 1</Text>
              </button>
              <button
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => setStatusFilter("level_2")}
              >
                <Text variant="span">Level 2</Text>
              </button>
              <button
                className="px-2 py-[6px] hover:bg-gray-100 text-left"
                onClick={() => setStatusFilter("level_3")}
              >
                <Text variant="span">Level 3</Text>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
