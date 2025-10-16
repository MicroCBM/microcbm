"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { Icon } from "@/libs";
import { cn } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  Text,
} from "@/components";
import { Asset } from "@/types";
import { ViewAssetModal } from "./ViewAssetModal";

interface AssetTableProps {
  data: Asset[];
  className?: string;
}

export function AssetTable({ data, className }: AssetTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedAsset(null);
  };

  const columns: ColumnDef<Asset>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 120,
    },
    {
      accessorKey: "site",
      header: "Site Assigned",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">
          {(getValue() as string) || "N/A"}
        </span>
      ),
      size: 250,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">
          {(getValue() as string) || "N/A"}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
      size: 100,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="small">
                <Icon
                  icon="mdi:dots-vertical"
                  className="w-4 h-4 text-gray-600"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="px-4 py-2 bg-black text-white">
                <Text variant="span">Select an option</Text>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                  onClick={() => handleViewAsset(row.original)}
                >
                  View User
                </button>
                <button className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100">
                  Approve User
                </button>
                <button className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100">
                  Edit User
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm">
                  Delete User
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      size: 80,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Group data by created_at date
  const groupedData = data.reduce((acc, asset) => {
    const createdDate = dayjs(asset.created_at_datetime);
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");

    let key: string;
    if (createdDate.isSame(today, "day")) {
      key = "TODAY";
    } else if (createdDate.isSame(yesterday, "day")) {
      key = "YESTERDAY";
    } else {
      // Format date as "Month Day, Year" (e.g., "October 12, 2025")
      key = createdDate.format("MMMM D, YYYY");
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  // Sort groups: TODAY, YESTERDAY, then dates in descending order
  const groupOrder = Object.keys(groupedData).sort((a, b) => {
    if (a === "TODAY") return -1;
    if (b === "TODAY") return 1;
    if (a === "YESTERDAY") return -1;
    if (b === "YESTERDAY") return 1;
    // Compare dates in descending order (newer first)
    return dayjs(b).valueOf() - dayjs(a).valueOf();
  });

  return (
    <div className={cn("border border-gray-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="bg-white-50">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))
              )}
            </tr>
          </thead>

          <tbody className="bg-white">
            {groupOrder.map((groupKey) => {
              const groupData = groupedData[groupKey];
              if (!groupData || groupData.length === 0) return null;

              return (
                <React.Fragment key={groupKey}>
                  {/* Group Header */}
                  <tr className="bg-gray-100">
                    <td
                      colSpan={columns.length}
                      className="px-4 py-2 text-sm font-medium text-gray-700 uppercase tracking-wide"
                    >
                      {groupKey}
                    </td>
                  </tr>

                  {/* Group Data Rows */}
                  {groupData.map((user) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === user.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={user.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 border-r border-gray-200 last:border-r-0"
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <ViewAssetModal
        asset={selectedAsset as Asset}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
