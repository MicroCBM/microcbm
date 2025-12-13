"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Text } from "@/components";
import { Icon } from "@/libs";
import { ComponentGuard } from "@/components/content-guard";
import { cn } from "@/libs";

interface QuickCreateOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  permission?: string;
  color: string;
}

const quickCreateOptions: QuickCreateOption[] = [
  {
    id: "sample",
    label: "Sample",
    description: "Create a new sample record",
    icon: "mdi:flask-outline",
    route: "/samples/add",
    permission: "samples:create",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
  {
    id: "asset",
    label: "Asset",
    description: "Add a new asset",
    icon: "mdi:package-variant",
    route: "/assets/add",
    permission: "assets:create",
    color: "bg-green-50 hover:bg-green-100 border-green-200",
  },
  {
    id: "site",
    label: "Site",
    description: "Create a new site",
    icon: "mdi:map-marker-outline",
    route: "/sites/add",
    permission: "sites:create",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  },
  {
    id: "recommendation",
    label: "Recommendation",
    description: "Add a new recommendation",
    icon: "mdi:lightbulb-outline",
    route: "/recommendations/add",
    permission: "recommendations:create",
    color: "bg-amber-50 hover:bg-amber-100 border-amber-200",
  },
  {
    id: "sampling-point",
    label: "Sampling Point",
    description: "Create a new sampling point",
    icon: "mdi:target",
    route: "/sampling-points/add",
    permission: "sampling_points:create",
    color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
  },
  {
    id: "sampling-route",
    label: "Sampling Route",
    description: "Add a new sampling route",
    icon: "mdi:map-outline",
    route: "/sampling-routes/add",
    permission: "sampling_routes:create",
    color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
  },
];

interface QuickCreateModalProps {
  children: React.ReactNode;
}

export function QuickCreateModal({ children }: QuickCreateModalProps) {
  const router = useRouter();

  const handleOptionClick = (route: string) => {
    router.push(route);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[600px] p-4"
        align="end"
        sideOffset={8}
      >
        <div className="mb-3">
          <Text variant="h6" className="font-semibold text-gray-900 mb-1">
            Quick Create
          </Text>
          <Text variant="span" className="text-sm text-gray-500">
            Select an option to quickly create a new record
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickCreateOptions.map((option) => (
            <ComponentGuard
              key={option.id}
              permissions={option.permission}
              unauthorizedFallback={null}
            >
              <button
                onClick={() => handleOptionClick(option.route)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left group",
                  option.color
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon
                    icon={option.icon}
                    className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Text variant="h6" className="font-semibold text-gray-900 mb-1">
                    {option.label}
                  </Text>
                  <Text variant="span" className="text-sm text-gray-600">
                    {option.description}
                  </Text>
                </div>
                <Icon
                  icon="mdi:chevron-right"
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </button>
            </ComponentGuard>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

