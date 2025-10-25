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
  Text,
} from "@/components";
import { Recommendation, Sites, Assets } from "@/types";
import { ViewRecommendationModal } from "./ViewRecommendationModal";
import { DeleteRecommendationModal } from "./DeleteRecommendationModal";
import { useRouter } from "next/navigation";
import { deleteRecommendationService } from "@/app/actions";
import { toast } from "sonner";
import { EditRecommendationModal } from "./EditRecommendationModal";

interface RecommendationTableProps {
  data: Recommendation[];
  className?: string;
  sites?: Sites[];
  assets?: Assets[];
}

export function RecommendationTable({
  data,
  className,
  sites = [],
  assets = [],
}: RecommendationTableProps) {
  const router = useRouter();
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Recommendation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedRecommendation(null);
  };

  const handleEditRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsEditModalOpen(true);
  };

  const handleDeleteRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRecommendation(null);
  };

  const handleConfirmDelete = async (recommendationId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteRecommendationService(recommendationId);
      if (response.success) {
        toast.success("Recommendation deleted successfully", {
          description: "The recommendation has been permanently removed.",
        });
        handleCloseDeleteModal();
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(
          response.message ||
            "Failed to delete recommendation. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to delete recommendation. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<Recommendation>[] = [
    {
      id: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900 font-medium">
            {row.original.title}
          </span>
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${getSeverityColor(
            row.original.severity
          )}`}
        >
          {row.original.severity.charAt(0).toUpperCase() +
            row.original.severity.slice(1)}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: "site",
      header: "Site",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.site?.name || row.original.site?.id || "-"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "asset",
      header: "Asset",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.asset?.name || row.original.asset?.id || "-"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "recommender",
      header: "Recommender",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.recommender?.name ||
            row.original.recommender?.id ||
            "-"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "created_at_datetime",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {dayjs(row.original.created_at_datetime).format("MMM D, YYYY HH:mm")}
        </span>
      ),
      size: 180,
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
                  onClick={() => handleViewRecommendation(row.original)}
                >
                  View Recommendation
                </button>
                <button
                  onClick={() => handleEditRecommendation(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Recommendation
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteRecommendation(row.original)}
                >
                  Delete Recommendation
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

  // If no recommendations data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No recommendations found. Create your first recommendation to get
            started.
          </p>
        </div>
      </div>
    );
  }

  // Group data by created_at_datetime date
  const groupedData = data.reduce((acc, recommendation) => {
    const createdDate = dayjs(recommendation.created_at_datetime);
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
    acc[key].push(recommendation);
    return acc;
  }, {} as Record<string, Recommendation[]>);

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
                  {groupData.map((recommendation) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === recommendation.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={recommendation.id}
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

      <ViewRecommendationModal
        recommendation={selectedRecommendation as Recommendation}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteRecommendationModal
        recommendation={selectedRecommendation}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditRecommendationModal
        recommendation={selectedRecommendation as Recommendation}
        recommendationId={selectedRecommendation?.id || ""}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        sites={sites}
        assets={assets}
      />
    </div>
  );
}
