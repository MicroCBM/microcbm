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
import { Organization } from "@/types";
import { ViewOrganizationModal } from "./ViewOrganizationModal";
import { DeleteOrganizationModal } from "./DeleteOrganizationModal";
import { useRouter } from "next/navigation";
import { deleteOrganizationService } from "@/app/actions";
import { toast } from "sonner";
import { EditOrganizationModal } from "./EditOrganizationModal";

interface OrganizationTableProps {
  data: Organization[];
  className?: string;
}

export function OrganizationTable({ data, className }: OrganizationTableProps) {
  const router = useRouter();
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleEditOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsEditModalOpen(true);
  };

  const handleDeleteOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleConfirmDelete = async (organizationId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteOrganizationService(organizationId);
      if (response.success) {
        toast.success("Organization deleted successfully", {
          description: "The organization has been permanently removed.",
        });
        handleCloseDeleteModal();
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(
          response.message || "Failed to delete organization. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to delete organization. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Organization>[] = [
    {
      id: "name",
      header: "Organization Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {/* {row.original.logo_url && (
            <img
              src={row.original.logo_url}
              alt={row.original.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )} */}
          <span className="text-sm text-gray-900">{row.original.name}</span>
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 capitalize">
          {row.original.industry}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "team_strength",
      header: "Team Size",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.team_strength}
        </span>
      ),
      size: 120,
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
      accessorKey: "owner",
      header: "Owner Name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 truncate max-w-xs">
          {row.original.owner?.first_name || "-"}{" "}
          {row.original.owner?.last_name || "-"}
        </span>
      ),
      size: 300,
    },
    {
      accessorKey: "sites",
      header: "Number of Sites",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 truncate max-w-xs">
          {row.original.sites?.length || 0}
        </span>
      ),
      size: 300,
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
                  onClick={() => handleViewOrganization(row.original)}
                >
                  View Organization
                </button>
                <button
                  onClick={() => handleEditOrganization(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Organization
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteOrganization(row.original)}
                >
                  Delete Organization
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

  // If no organizations data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No organizations found. Create your first organization to get
            started.
          </p>
        </div>
      </div>
    );
  }

  // Group data by created_at date
  const groupedData = data.reduce((acc, organization) => {
    const createdDate = dayjs(organization.created_at_datetime);
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
    acc[key].push(organization);
    return acc;
  }, {} as Record<string, Organization[]>);

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
                  {groupData.map((organization) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === organization.id);
                    if (!row) return null;

                    return (
                      <tr
                        key={organization.id}
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

      <ViewOrganizationModal
        organization={selectedOrganization as Organization}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteOrganizationModal
        organization={selectedOrganization}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditOrganizationModal
        organization={selectedOrganization as Organization}
        organizationId={selectedOrganization?.id || ""}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </div>
  );
}
