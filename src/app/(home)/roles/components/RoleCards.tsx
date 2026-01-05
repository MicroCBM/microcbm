"use client";
import React, { useState, useEffect } from "react";
import { Text, Button, StatusBadge, Search } from "@/components";
import { Icon } from "@/libs";

import { deleteRoleService } from "@/app/actions";
import { toast } from "sonner";
import { EditRoleModal } from "./EditRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { EditPermissions } from "./RoleForm/EditPermissions";
import { useRouter } from "next/navigation";
import { useUrlState } from "@/hooks";
import { Dropdown } from "@/components/dropdown";

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  description: string;
  created_at: number;
  created_at_datetime: string;
  active: boolean;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}
interface RoleCardsProps {
  data: Role[];
  onRoleDeleted?: () => void;
  onRoleUpdated?: () => void;
  permissions: Permission[] | null;
  rolePermissions?: Permission[] | null;
  selectedRoleId?: string | null;
}

export function RoleCards({
  data,
  permissions,
  onRoleDeleted,
  onRoleUpdated,
  rolePermissions,
  selectedRoleId,
}: RoleCardsProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewPermissionsModalOpen, setIsViewPermissionsModalOpen] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchName, setSearchName] = useUrlState("name", "");
  const [, setRoleId] = useUrlState("roleId", "");

  // Find the selected role from data
  const selectedRoleFromData = selectedRoleId
    ? data.find((role) => role.id === selectedRoleId)
    : null;

  // Get permissions for the selected role from server-fetched data
  // rolePermissions should already be an array, but handle edge cases
  const selectedPermissions: Permission[] =
    selectedRoleId && rolePermissions !== null && rolePermissions !== undefined
      ? Array.isArray(rolePermissions)
        ? rolePermissions
        : []
      : [];

  // Effect to handle opening modal when permissions are loaded from server
  useEffect(() => {
    // Only open modal if:
    // 1. roleId is set in URL (selectedRoleId is not null)
    // 2. Permissions have been fetched (rolePermissions is not null/undefined - includes empty arrays)
    // 3. Role data is available
    // 4. Modal is not already open (to prevent reopening when clearing roleId)
    if (
      selectedRoleId &&
      rolePermissions !== null &&
      rolePermissions !== undefined &&
      selectedRoleFromData &&
      !isViewPermissionsModalOpen
    ) {
      // Permissions have been fetched (even if empty array), set the selected role and open modal
      setSelectedRole(selectedRoleFromData);
      setIsViewPermissionsModalOpen(true);
    }
    // Close modal if roleId is cleared
    if (!selectedRoleId && isViewPermissionsModalOpen) {
      setIsViewPermissionsModalOpen(false);
      setSelectedRole(null);
    }
  }, [
    selectedRoleId,
    rolePermissions,
    selectedRoleFromData,
    isViewPermissionsModalOpen,
  ]);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  const handleViewPermissions = (role: Role) => {
    // Update URL to trigger server-side fetch
    setRoleId(role.id);
    // Modal will open automatically via useEffect when permissions are loaded
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleConfirmDelete = async (roleId: string) => {
    setIsDeleting(true);
    console.log("roleId", roleId);
    try {
      const response = await deleteRoleService(roleId);
      console.log("response in handleConfirmDelete", response);
      if (response.success) {
        toast.success("Role deleted successfully", {
          description: "The role has been permanently removed.",
        });
        onRoleDeleted?.();
        handleCloseDeleteModal();
        router.refresh();
      } else {
        toast.error(
          response.message || "Failed to delete role. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to delete role. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon icon="mdi:account-group" className="w-8 h-8 text-gray-400" />
        </div>
        <Text variant="h6" className="text-gray-900 mb-2">
          No roles found
        </Text>
        <Text variant="span" className="text-gray-500">
          Create your first role to get started.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Role Cards Grid */}
      <Search
        value={searchName}
        onChange={(event) => setSearchName(event.target.value)}
        placeholder="Search roles"
        className="h-10 max-w-[296px]"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((role) => (
          <div
            key={role.id}
            className="border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:account-badge"
                    className="w-5 h-5 text-gray-600"
                  />
                </div>
                <section className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Text variant="span" className="text-gray-900">
                      {role.name}
                    </Text>
                    <StatusBadge status={role.active ? "Active" : "Inactive"} />
                  </div>

                  {/* should span 2 lines */}
                  <p className="text-[#807f94] text-xs line-clamp-2">
                    {role.description || "No description"}
                  </p>
                </section>
              </div>

              <Dropdown
                actions={[
                  {
                    label: "View Details",
                    onClickFn: () => router.push(`/roles/view/${role.id}`),
                  },
                  {
                    label: "Edit Role",
                    onClickFn: () => handleEditRole(role),
                  },
                  {
                    label: "View Permissions",
                    onClickFn: () => handleViewPermissions(role),
                  },
                  {
                    label: "Delete Role",
                    onClickFn: () => handleDeleteRole(role),
                  },
                ]}
                // permission={[
                //   "roles:view",
                //   "roles:edit",
                //   "roles:delete",
                //   "roles:view-permissions",
                // ]}
              >
                <button
                  type="button"
                  className="btn rounded-lg no-print"
                  aria-label="View actions"
                >
                  <Icon
                    icon="mdi:dots-vertical"
                    className="w-4 h-4 text-gray-600"
                  />
                </button>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Text variant="span" className="text-sm text-gray-500">
          Total {data.length} items
        </Text>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" disabled>
            Previous
          </Button>
          <Button variant="outline" size="small">
            Next
          </Button>
        </div>
      </div>

      <DeleteRoleModal
        role={selectedRole}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditRoleModal
        role={selectedRole}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onRoleUpdated={onRoleUpdated}
      />
      <EditPermissions
        roleId={selectedRoleId || ""}
        data={selectedPermissions}
        permissions={permissions}
        isOpen={isViewPermissionsModalOpen}
        onClose={() => {
          setRoleId("");
        }}
      />
    </div>
  );
}
