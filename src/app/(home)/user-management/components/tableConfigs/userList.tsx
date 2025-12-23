"use client";

import { Icon } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  Text,
  UserAvatar,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import type { CsvHeader } from "@/types";
import type { Sites } from "@/types";

// USER_TYPE should match the one from UserTable
// This is a minimal interface for the columns - full type is in UserTable
interface USER_TYPE {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string | null;
  site: {
    id: string;
    name: string;
  } | null;
  country: string;
  status: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserListColumnsProps<T extends USER_TYPE = USER_TYPE> {
  rolesData: Role[];
  sites: Sites[];
  onViewUser: (user: T) => void;
  onEditUser: (user: T) => void;
  onApproveUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
  userPermissions?: string[];
  loginUser?: { role?: string };
}

export function getUserListColumns<T extends USER_TYPE = USER_TYPE>({
  rolesData,
  sites,
  onViewUser,
  onEditUser,
  onApproveUser,
  onDeleteUser,
  userPermissions = [],
  loginUser,
}: UserListColumnsProps<T>): ColumnDef<T>[] {
  const isSuperAdmin = loginUser?.role === "SuperAdmin";
  console.log("userPermissions stuff", userPermissions);

  // Helper function to check if user has permission
  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    return userPermissions.some(
      (perm) => perm.toLowerCase() === permission.toLowerCase()
    );
  };

  // Check permissions for each action
  const canView = hasPermission("users:read");
  const canEdit = hasPermission("users:update");
  const canDelete = hasPermission("users:delete");
  const canApprove = hasPermission("users:update");
  return [
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
      cell: ({ row }) => {
        const roleData = rolesData.find((r) => r.id === row.original.role_id);
        return (
          <span className="text-sm text-gray-900">
            {roleData?.name || "N/A"}
          </span>
        );
      },
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
        const isActive =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() ===
          "Active";

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
                  {canView && (
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                      onClick={() => onViewUser(row.original)}
                    >
                      View User
                    </button>
                  )}
                  {canApprove && (
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onApproveUser(id)}
                      disabled={isActive}
                    >
                      Approve User
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => onEditUser(row.original)}
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                    >
                      Edit User
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                      onClick={() => onDeleteUser(id)}
                    >
                      Delete User
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      size: 80,
    },
  ];
}

export const userListCsvHeaders: Array<CsvHeader> = [
  {
    name: "Name",
    accessor: "name",
  },
  {
    name: "Role",
    accessor: "role.name",
  },
  {
    name: "Site Assigned",
    accessor: "site.name",
  },
  {
    name: "Email",
    accessor: "email",
  },
  {
    name: "Country",
    accessor: "country",
  },
  {
    name: "Status",
    accessor: "status",
  },
];
