"use client";

import React from "react";
import { Icon } from "@/libs";
import { cn } from "@/libs";

interface TableData {
  siteName: string;
  location: string;
  nextDue: string;
  activeSPs: number;
  assetCount: number;
  status: string;
}

interface GroupedData {
  group: string;
  data: TableData[];
}

interface DataTableProps {
  data: GroupedData[];
  className?: string;
}

export function DataTable({ data, className }: DataTableProps) {
  return (
    <div className={cn("border border-gray-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-white-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-gray-200">
                Site name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-gray-200">
                Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-gray-200">
                Next Due
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-gray-200">
                Active SPs
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-gray-200">
                Asset Count
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold  border-r border-gray-200">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((group, groupIndex) => (
              <React.Fragment key={group.group}>
                {/* Group Header */}
                <tr className="bg-white-200">
                  <td
                    colSpan={7}
                    className="px-4 py-2 text-sm font-medium uppercase tracking-wide"
                  >
                    {group.group}
                  </td>
                </tr>

                {/* Group Data Rows */}
                {group.data.map((row, rowIndex) => (
                  <tr
                    key={`${group.group}-${rowIndex}`}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-[#616161] border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-300 rounded-sm flex-shrink-0"></div>
                        {row.siteName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#616161] border-r border-gray-200">
                      {row.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#616161] border-r border-gray-200">
                      {row.nextDue}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#616161] border-r border-gray-200">
                      {row.activeSPs}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#616161] border-r border-gray-200">
                      {row.assetCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#616161] border-r border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <Icon
                          icon="mdi:dots-vertical"
                          className="w-4 h-4 text-gray-600"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
