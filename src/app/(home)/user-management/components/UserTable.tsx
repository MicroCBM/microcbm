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
  UserAvatar,
} from "@/components";
import { Organization, Sites, User } from "@/types";
import { ViewUserModal } from "./ViewUserModal";
import { activateUserService, deleteUserService } from "@/app/actions/user";
import { toast } from "sonner";
import { EditNewUser } from "./EditNewUser";

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  created_at: number;
  created_at_datetime: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}
interface UserTableProps {
  data: User[];
  className?: string;
  rolesData: Role[];
  organizations: Organization[];
  sites: Sites[];
}

export function UserTable({
  data,
  className,
  rolesData,
  organizations,
  sites,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleApproveUser = async (id: string) => {
    const result = await activateUserService(id);
    if (result.success) {
      toast.success("User approved and activated successfully!");
      // Optionally refresh the page or update the user data
      window.location.reload();
    } else {
      toast.error(result.message || "Failed to approve user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await deleteUserService(id);
    if (result.success) {
      toast.success("User deleted successfully!");
      // Optionally refresh the page or update the user data
      window.location.reload();
    } else {
      toast.error(result.message || "Failed to delete user");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <UserAvatar
          firstName={row.original.first_name}
          lastName={row.original.last_name}
        />
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
      cell: ({ row }) => {
        const site = row.original.site;
        const siteData = sites.find((s) => s.id === site?.id);
        return (
          <span className="text-sm text-gray-900">
            {siteData?.name || "N/A"}
          </span>
        );
      },
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
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const capitalizedStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
          <StatusBadge
            status={capitalizedStatus as "Active" | "Inactive" | "Pending"}
          />
        );
      },
      size: 100,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { status, id } = row.original;
        return (
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
                    onClick={() => handleViewUser(row.original)}
                  >
                    View User
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleApproveUser(id)}
                    disabled={
                      status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase() ===
                      "Active"
                    }
                  >
                    Approve User
                  </button>
                  <button
                    onClick={() => handleEditUser(row.original)}
                    className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                  >
                    Edit User
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDeleteUser(id)}
                  >
                    Delete User
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      size: 80,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Group data by created_at date
  const groupedData = data.reduce((acc, user) => {
    const createdDate = dayjs(user.created_at_datetime);
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
    acc[key].push(user);
    return acc;
  }, {} as Record<string, User[]>);

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

      <ViewUserModal
        user={selectedUser}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <EditNewUser
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rolesData={rolesData}
        organizations={organizations}
        sites={sites}
      />
    </div>
  );
}
