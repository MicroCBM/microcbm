"use client";
import { Button, StatusBadge, Switch, Text } from "@/components";
import { Icon } from "@/libs";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { EditRoleModal } from "./EditRoleModal";
import React from "react";
import {
  deleteRoleService,
  toggleRoleActiveStatusService,
} from "@/app/actions/roles";
import { toast } from "sonner";
import { DeleteRoleModal } from "./DeleteRoleModal";

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  created_at: number;
  created_at_datetime: string;
  description: string;
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

export function SingleRoleInfo({ role }: Readonly<{ role: Role }>) {
  const [isRoleActive, setIsRoleActive] = React.useState(role.active);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteRoleService(role.id);
      console.log("response", response);
      if (response.success) {
        toast.success(response.message || "Role deleted successfully.");
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

  const handleToggleRoleActive = async () => {
    const response = await toggleRoleActiveStatusService(role.id);
    if (response.success) {
      setIsRoleActive(!isRoleActive);
      toast.success(
        response.message || "Role active status toggled successfully."
      );
    } else {
      toast.error(
        response.message ||
          "Failed to toggle role active status. Please try again."
      );
    }
  };

  React.useEffect(() => {
    setIsRoleActive(role.active);
  }, [role.active]);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const router = useRouter();

  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 border border-gray-200 flex items-center justify-center"
          >
            <Icon icon="mdi:chevron-left" className=" size-5" />
          </button>

          <Text variant="h6">Role & Permissions</Text>
        </div>
        <section className="flex flex-col gap-3 py-2">
          <div className="p-2 rounded-lg bg-gray-100 w-fit">
            <Icon icon="hugeicons:id" className="text-gray-600 size-10" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Text variant="h6" weight="medium">
                {role.name}
              </Text>
              <StatusBadge status={role.active ? "Active" : "Inactive"} />
            </div>
            <Text variant="span" className="text-gray-600">
              {role.description}
            </Text>
          </div>
        </section>
        <section className=" border-y border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gray-100 w-fit">
                <Icon icon="hugeicons:user" className="text-gray-600 size-5" />
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  No. of Users
                </Text>
                <Text variant="span">10</Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gray-100 w-fit">
                <Icon
                  icon="hugeicons:calendar-01"
                  className="text-gray-600 size-5"
                />
              </div>
              <div>
                <Text variant="span" className="text-gray-600">
                  Created At
                </Text>
                <Text variant="span">
                  {dayjs(role.created_at).format("DD MMM YYYY")}
                </Text>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="small"
              className="group"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Icon
                icon="hugeicons:edit-01"
                className="text-gray-600 size-5 group-hover:text-white"
              />
              Edit Role
            </Button>
            <div className="flex items-center gap-2 text-xs border border-grey py-2 px-4">
              Deactivate Role
              <Switch
                className="cursor-pointer"
                checked={isRoleActive}
                onCheckedChange={handleToggleRoleActive}
              />
            </div>
            <Button
              variant="outline"
              size="small"
              className="group text-red-500 hover:bg-red-500"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Icon
                icon="hugeicons:edit-01"
                className="text-red-500 size-5 group-hover:text-white"
              />
              Delete Role
            </Button>
          </div>
        </section>
      </section>
      <EditRoleModal
        role={role}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
      <DeleteRoleModal
        role={role}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
