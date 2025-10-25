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
import { SamplingPoint } from "@/types";
import { ViewSamplingPointModal, DeleteSamplingPointModal } from "./";
import { useRouter } from "next/navigation";
import { deleteSamplingPointService } from "@/app/actions";
import { toast } from "sonner";

interface SamplingPointTableProps {
  data: SamplingPoint[];
  className?: string;
  onSamplingPointDeleted?: () => void;
}

export function SamplingPointTable({
  data,
  className,
  onSamplingPointDeleted,
}: SamplingPointTableProps) {
  const router = useRouter();
  const [selectedSamplingPoint, setSelectedSamplingPoint] =
    useState<SamplingPoint | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewSamplingPoint = (samplingPoint: SamplingPoint) => {
    setSelectedSamplingPoint(samplingPoint);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedSamplingPoint(null);
  };

  const handleEditSamplingPoint = (samplingPoint: SamplingPoint) => {
    setSelectedSamplingPoint(samplingPoint);
    router.push(`/sampling-points/edit/${samplingPoint.id}`);
  };

  const handleDeleteSamplingPoint = (samplingPoint: SamplingPoint) => {
    setSelectedSamplingPoint(samplingPoint);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSamplingPoint(null);
  };

  const handleConfirmDelete = async (samplingPointId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteSamplingPointService(samplingPointId);
      if (response.success) {
        toast.success("Sampling point deleted successfully", {
          description: "The sampling point has been permanently removed.",
        });
        onSamplingPointDeleted?.();
        handleCloseDeleteModal();
      } else {
        toast.error(
          response.message ||
            "Failed to delete sampling point. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to delete sampling point. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<SamplingPoint>[] = [
    {
      id: "name",
      header: "Sampling Point Name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.name}</span>
      ),
      size: 200,
    },
    {
      accessorKey: "parent_asset.name",
      header: "Parent Asset",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.parent_asset.name}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "tag",
      header: "Tag",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.tag}</span>
      ),
      size: 120,
    },
    {
      accessorKey: "component_type",
      header: "Component Type",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 capitalize">
          {row.original.component_type}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "circuit_type",
      header: "Circuit Type",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.circuit_type}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: "sample_frequency",
      header: "Sample Frequency",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.sample_frequency}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <StatusBadge
          status={
            (row.original.severity.charAt(0).toUpperCase() +
              row.original.severity.slice(1).toLowerCase()) as
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
                  onClick={() => handleViewSamplingPoint(row.original)}
                >
                  View Sampling Point
                </button>
                <button
                  onClick={() => handleEditSamplingPoint(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Sampling Point
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteSamplingPoint(row.original)}
                >
                  Delete Sampling Point
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

  // If no sampling points data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No sampling points found. Create your first sampling point to get
            started.
          </p>
        </div>
      </div>
    );
  }

  // Group data by created_at date
  const groupedData = data.reduce((acc, samplingPoint) => {
    const createdDate = dayjs(samplingPoint.created_at_datetime);
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
    acc[key].push(samplingPoint);
    return acc;
  }, {} as Record<string, SamplingPoint[]>);

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
                  {groupData.map((samplingPoint) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === samplingPoint.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={samplingPoint.id}
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

      <ViewSamplingPointModal
        samplingPoint={selectedSamplingPoint as SamplingPoint}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteSamplingPointModal
        samplingPoint={selectedSamplingPoint}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
