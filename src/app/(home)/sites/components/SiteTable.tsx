"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { Icon } from "@/libs";
import { cn } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@/components";
import { Organization, Sites } from "@/types";
import { ViewSiteModal } from "./ViewSiteModal";
import dayjs from "dayjs";
import { EditSite } from "./EditSite";
import { deleteSiteService } from "@/app/actions";
import { toast } from "sonner";

interface SiteTableProps {
  sites: Sites[];
  className?: string;
  organizations: Organization[];
}

export function SiteTable({ sites, className, organizations }: SiteTableProps) {
  const [selectedSite, setSelectedSite] = useState<Sites | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleViewSite = (site: Sites) => {
    setSelectedSite(site);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedSite(null);
  };

  const handleEditSite = (site: Sites) => {
    setSelectedSite(site);
    setIsEditModalOpen(true);
  };

  const handleDeleteSite = async (id: string) => {
    try {
      const result = await deleteSiteService(id);
      if (result.success) {
        toast.success("Site deleted successfully!");
        // Optionally refresh the page or update the sites data
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to delete site");
      }
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("An error occurred while deleting the site");
    }
  };

  const columns: ColumnDef<Sites>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => {
        return (
          <span className="text-sm text-gray-900">{getValue() as string}</span>
        );
      },
      size: 200,
    },
    {
      accessorKey: "tag",
      header: "Site Tag",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 100,
    },
    {
      accessorKey: "installation_environment",
      header: "Installation Environment",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">
          {(getValue() as string) || "N/A"}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "regulations_and_standards",
      header: "Regulations and Standards",
      cell: ({ getValue }) => {
        const regulations = getValue() as string[];
        return (
          <span className="text-sm text-gray-900">
            {regulations && regulations.length > 0
              ? regulations.join(", ")
              : "N/A"}
          </span>
        );
      },
      size: 100,
    },
    {
      accessorKey: "manager_name",
      header: "Manager Name",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 100,
    },
    {
      accessorKey: "manager_email",
      header: "Manager Email",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 100,
    },
    {
      accessorKey: "manager_phone_number",
      header: "Manager Phone Number",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-900">{getValue() as string}</span>
      ),
      size: 100,
    },
    {
      accessorKey: "actions",
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
                  onClick={() => handleViewSite(row.original)}
                >
                  View Site
                </button>
                <button
                  onClick={() => handleEditSite(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Site
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteSite(row.original.id)}
                >
                  Delete Site
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
    data: sites,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // If no sites data, show empty state
  if (!sites || sites.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No sites found. Create your first site to get started.
          </p>
        </div>
      </div>
    );
  }

  const groupedData = sites.reduce((acc, site) => {
    const createdDate = dayjs(site.created_at_datetime);
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
    acc[key].push(site);
    return acc;
  }, {} as Record<string, Sites[]>);

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

      <ViewSiteModal
        site={selectedSite}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <EditSite
        site={selectedSite}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        organizations={organizations}
      />
    </div>
  );
}
