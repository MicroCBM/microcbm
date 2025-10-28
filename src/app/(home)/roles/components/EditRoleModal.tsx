"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Text,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Icon } from "@/libs";
import { EditRolePayload, EDIT_ROLE_SCHEMA } from "@/schema";
import { editRoleService, getPermissionsService } from "@/app/actions";
import Input from "@/components/input/Input";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

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

interface EditRoleModalProps {
  role: Role | null;
  isOpen: boolean;
  onClose: () => void;
  onRoleUpdated?: () => void;
}

export function EditRoleModal({
  role,
  isOpen,
  onClose,
  onRoleUpdated,
}: EditRoleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditRolePayload>({
    resolver: zodResolver(EDIT_ROLE_SCHEMA),
    defaultValues: {
      name: role?.name || "",
      description: "",
      status: "active",
      permissions: [],
    },
  });

  useEffect(() => {
    if (isOpen && role) {
      reset({
        name: role.name,
        description: "",
        status: "active",
        permissions: [],
      });

      const fetchPermissions = async () => {
        try {
          const data = await getPermissionsService();
          setPermissions(data);
        } catch (error) {
          console.error("Error fetching permissions:", error);
          toast.error("Failed to fetch permissions");
        }
      };

      fetchPermissions();
    }
  }, [isOpen, role, reset]);

  const onSubmit = async (data: EditRolePayload) => {
    if (!role) return;

    setIsSubmitting(true);
    try {
      const response = await editRoleService(role.id, data);
      if (response.success) {
        toast.success("Role updated successfully", {
          description: "The role has been updated in your system.",
        });
        onRoleUpdated?.();
        handleClose();
      } else {
        toast.error(
          response.message || "Failed to update role. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit as SubmitHandler<EditRolePayload>)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <Text variant="h6">Basic Information</Text>

              <Input
                label="Role Name"
                placeholder="e.g., Operations Manager"
                {...register("name")}
                error={errors.name?.message}
              />

              <div className="space-y-2">
                <Text variant="h6">Description</Text>
                <textarea
                  {...register("description")}
                  placeholder="Describe the role's responsibilities and scope..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                {errors.description && (
                  <Text variant="span" className="text-red-500 text-sm">
                    {errors.description.message}
                  </Text>
                )}
              </div>

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger label="Status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <Text variant="h6">Permissions</Text>
              <div className="space-y-4">
                <Text variant="span" className="text-sm text-gray-600">
                  Select the permissions this role should have:
                </Text>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={permission.id}
                        {...register("permissions")}
                        defaultChecked={role.permissions?.includes(permission)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <Text
                          variant="span"
                          className="font-medium text-gray-900"
                        >
                          {permission.name}
                        </Text>
                        <Text
                          variant="span"
                          className="text-sm text-gray-500 block"
                        >
                          {permission.name}
                        </Text>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-6">
              {isSubmitting ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
