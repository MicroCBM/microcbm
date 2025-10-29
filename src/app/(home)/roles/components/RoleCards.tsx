"use client";
import React, { useState } from "react";
import { Text, Button, StatusBadge } from "@/components";
import { Icon } from "@/libs";

import { deleteRoleService } from "@/app/actions";
import { toast } from "sonner";
import { EditRoleModal } from "./EditRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";

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
}

export function RoleCards({
  data,
  onRoleDeleted,
  onRoleUpdated,
}: RoleCardsProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
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
    try {
      const response = await deleteRoleService(roleId);
      if (response.success) {
        toast.success("Role deleted successfully", {
          description: "The role has been permanently removed.",
        });
        onRoleDeleted?.();
        handleCloseDeleteModal();
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
    <div className="space-y-6">
      {/* Role Cards Grid */}
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
              <div className="relative">
                <button
                  onClick={() => {
                    // Handle options menu
                    const menu = document.getElementById(
                      `role-menu-${role.id}`
                    );
                    if (menu) {
                      menu.classList.toggle("hidden");
                    }
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Icon
                    icon="mdi:dots-vertical"
                    className="w-4 h-4 text-gray-600"
                  />
                </button>
                <div
                  id={`role-menu-${role.id}`}
                  className="hidden absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <button
                    onClick={() => handleEditRole(role)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete Role
                  </button>
                </div>
              </div>
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
    </div>
  );
}
