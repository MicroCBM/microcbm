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
import { Department } from "@/types";

// import { useRouter } from "next/navigation";
import { deleteDepartmentService } from "@/app/actions";
import { toast } from "sonner";
import { ViewDepartmentModal } from "./ViewDepartmentModal";
import { DeleteDepartmentModal } from "./DeleteDepartmentModal";
import { EditDepartmentModal } from "./EditDepartmentModal";

interface DepartmentTableProps {
  data: Department[];
  className?: string;
}

export function DepartmentTable({ data, className }: DepartmentTableProps) {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleConfirmDelete = async (departmentId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteDepartmentService(departmentId);
      if (response.success) {
        toast.success("Department deleted successfully", {
          description: "The department has been permanently removed.",
        });
        handleCloseDeleteModal();
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(
          response.message || "Failed to delete department. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to delete department. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Department>[] = [
    {
      id: "name",
      header: "Department Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900">{row.original.name}</span>
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: "organization",
      header: "Organization",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.organization.name || "-"}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 truncate max-w-[200px] block">
          {row.original.description || "-"}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: "created_at_datetime",
      header: "Created Date",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {dayjs(row.original.created_at_datetime).format("MMM D, YYYY")}
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
                  onClick={() => handleViewDepartment(row.original)}
                >
                  View Department
                </button>
                <button
                  onClick={() => handleEditDepartment(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Department
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteDepartment(row.original)}
                >
                  Delete Department
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

  // If no departments data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No departments found. Create your first department to get started.
          </p>
        </div>
      </div>
    );
  }

  // Group data by created_at date
  const groupedData = data.reduce((acc, department) => {
    const createdDate = dayjs(department.created_at_datetime);
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
    acc[key].push(department);
    return acc;
  }, {} as Record<string, Department[]>);

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
                  {groupData.map((department) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === department.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={department.id}
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

      <ViewDepartmentModal
        department={selectedDepartment as Department}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteDepartmentModal
        department={selectedDepartment}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditDepartmentModal
        department={selectedDepartment as Department}
        departmentId={selectedDepartment?.id || ""}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </div>
  );
}
