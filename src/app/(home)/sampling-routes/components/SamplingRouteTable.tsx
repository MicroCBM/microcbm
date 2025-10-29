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
import { SamplingRoute } from "@/types";
import { ViewSamplingRouteModal, DeleteSamplingRouteModal } from "./index";
import { useRouter } from "next/navigation";
import { deleteSamplingRouteService } from "@/app/actions";
import { toast } from "sonner";

interface SamplingRouteTableProps {
  data: SamplingRoute[];
  className?: string;
  onSamplingRouteDeleted?: () => void;
}

export function SamplingRouteTable({
  data,
  className,
  onSamplingRouteDeleted,
}: SamplingRouteTableProps) {
  const router = useRouter();
  const [selectedSamplingRoute, setSelectedSamplingRoute] =
    useState<SamplingRoute | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewSamplingRoute = (samplingRoute: SamplingRoute) => {
    setSelectedSamplingRoute(samplingRoute);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedSamplingRoute(null);
  };

  const handleEditSamplingRoute = (samplingRoute: SamplingRoute) => {
    setSelectedSamplingRoute(samplingRoute);
    router.push(`/sampling-routes/edit/${samplingRoute.id}`);
  };

  const handleDeleteSamplingRoute = (samplingRoute: SamplingRoute) => {
    setSelectedSamplingRoute(samplingRoute);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSamplingRoute(null);
  };

  const handleConfirmDelete = async (samplingRouteId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteSamplingRouteService(samplingRouteId);
      if (response.success) {
        toast.success("Sampling route deleted successfully", {
          description: "The sampling route has been permanently removed.",
        });
        onSamplingRouteDeleted?.();
        handleCloseDeleteModal();
      } else {
        toast.error(
          response.message ||
            "Failed to delete sampling route. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to delete sampling route. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<SamplingRoute>[] = [
    {
      id: "name",
      header: "Route Name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.name}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.description}
        </span>
      ),
      size: 250,
    },
    {
      accessorKey: "site.name",
      header: "Site",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.site.name}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "technician",
      header: "Technician",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.technician
            ? `${row.original.technician.first_name} ${row.original.technician.last_name}`
            : "Not assigned"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={
            (row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1).toLowerCase()) as
              | "Active"
              | "Inactive"
              | "Pending"
              | "Low"
              | "Medium"
              | "High"
          }
        />
      ),
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
                  onClick={() => handleViewSamplingRoute(row.original)}
                >
                  View Sampling Route
                </button>
                <button
                  onClick={() => handleEditSamplingRoute(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Sampling Route
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteSamplingRoute(row.original)}
                >
                  Delete Sampling Route
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

  // If no sampling routes data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No sampling routes found. Create your first sampling route to get
            started.
          </p>
        </div>
      </div>
    );
  }

  // Group data by created_at date
  const groupedData = data.reduce((acc, samplingRoute) => {
    const createdDate = dayjs(samplingRoute.created_at_datetime);
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
    acc[key].push(samplingRoute);
    return acc;
  }, {} as Record<string, SamplingRoute[]>);

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
                  {groupData.map((samplingRoute) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === samplingRoute.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={samplingRoute.id}
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

      <ViewSamplingRouteModal
        samplingRoute={selectedSamplingRoute as SamplingRoute}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteSamplingRouteModal
        samplingRoute={selectedSamplingRoute}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
