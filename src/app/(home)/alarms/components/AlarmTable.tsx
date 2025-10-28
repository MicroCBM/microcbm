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
import { Alarm, Sites } from "@/types";
import { ViewAlarmModal } from "./ViewAlarmModal";
import { DeleteAlarmModal } from "./DeleteAlarmModal";
import { deleteAlarmService } from "@/app/actions";
import { toast } from "sonner";
import { EditAlarmModal } from "./EditAlarmModal";

interface AlarmTableProps {
  data: Alarm[];
  className?: string;
  sites?: Sites[];
}

export function AlarmTable({ data, className, sites = [] }: AlarmTableProps) {
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewAlarm = (alarm: Alarm) => {
    setSelectedAlarm(alarm);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedAlarm(null);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setSelectedAlarm(alarm);
    setIsEditModalOpen(true);
  };

  const handleDeleteAlarm = (alarm: Alarm) => {
    setSelectedAlarm(alarm);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAlarm(null);
  };

  const handleConfirmDelete = async (alarmId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteAlarmService(alarmId);
      if (response.success) {
        toast.success("Alarm deleted successfully", {
          description: "The alarm has been permanently removed.",
        });
        handleCloseDeleteModal();
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(
          response.message || "Failed to delete alarm. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to delete alarm. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Alarm>[] = [
    {
      id: "parameter",
      header: "Parameter",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900">
            {row.original.parameter}
          </span>
        </div>
      ),
      size: 200,
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
      accessorKey: "first_detected",
      header: "First Detected",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {dayjs(row.original.first_detected).format("MMM D, YYYY HH:mm")}
        </span>
      ),
      size: 180,
    },
    {
      accessorKey: "acknowledged_status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            row.original.acknowledged_status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.acknowledged_status ? "Acknowledged" : "Unacknowledged"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "linked_recommendations",
      header: "Recommendations",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.linked_recommendations?.length || 0}
        </span>
      ),
      size: 150,
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
                  onClick={() => handleViewAlarm(row.original)}
                >
                  View Alarm
                </button>
                <button
                  onClick={() => handleEditAlarm(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Alarm
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteAlarm(row.original)}
                >
                  Delete Alarm
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

  // If no alarms data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No alarms found. Create your first alarm to get started.
          </p>
        </div>
      </div>
    );
  }

  // Group data by first_detected date
  const groupedData = data.reduce((acc, alarm) => {
    const detectedDate = dayjs(alarm.first_detected);
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");

    let key: string;
    if (detectedDate.isSame(today, "day")) {
      key = "TODAY";
    } else if (detectedDate.isSame(yesterday, "day")) {
      key = "YESTERDAY";
    } else {
      // Format date as "Month Day, Year" (e.g., "October 12, 2025")
      key = detectedDate.format("MMMM D, YYYY");
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(alarm);
    return acc;
  }, {} as Record<string, Alarm[]>);

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
                  {groupData.map((alarm) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === alarm.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={alarm.id}
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

      <ViewAlarmModal
        alarm={selectedAlarm as Alarm}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteAlarmModal
        alarm={selectedAlarm}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditAlarmModal
        alarm={selectedAlarm as Alarm}
        alarmId={selectedAlarm?.id || ""}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        sites={sites}
      />
    </div>
  );
}
