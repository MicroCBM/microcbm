"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Text } from "@/components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { Icon } from "@/libs";
import { AddRolePayload, ADD_ROLE_SCHEMA } from "@/schema";
import { addRolePermissionsToRoleService, addRoleService } from "@/app/actions";
import Input from "@/components/input/Input";
import { useRouter } from "next/navigation";
import { Permission } from "@/types";

export function AddRoleModal({
  permissionsData,
}: {
  permissionsData: Permission[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions] = useState<Permission[]>(permissionsData);
  const [loadingPermissions] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddRolePayload>({
    resolver: zodResolver(ADD_ROLE_SCHEMA),
    defaultValues: {
      level: 1,
      permissions: [],
    },
  });

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const resource = permission.resource;
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Handle permission selection
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      const newSelected = [...selectedPermissions, permissionId];
      setSelectedPermissions(newSelected);
      setValue("permissions", newSelected);
    } else {
      const newSelected = selectedPermissions.filter(
        (id) => id !== permissionId
      );
      setSelectedPermissions(newSelected);
      setValue("permissions", newSelected);
    }
  };

  // Handle resource selection (select all permissions for a resource)
  const handleResourceChange = (resource: string, checked: boolean) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);

    if (checked) {
      const newSelected = [...selectedPermissions, ...resourcePermissionIds];
      setSelectedPermissions(newSelected);
      setValue("permissions", newSelected);
    } else {
      const newSelected = selectedPermissions.filter(
        (id) => !resourcePermissionIds.includes(id)
      );
      setSelectedPermissions(newSelected);
      setValue("permissions", newSelected);
    }
  };

  // Check if all permissions for a resource are selected
  const isResourceFullySelected = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    return resourcePermissions.every((permission) =>
      selectedPermissions.includes(permission.id)
    );
  };

  // Check if some permissions for a resource are selected
  const isResourcePartiallySelected = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    const selectedCount = resourcePermissions.filter((permission) =>
      selectedPermissions.includes(permission.id)
    ).length;
    return selectedCount > 0 && selectedCount < resourcePermissions.length;
  };

  // Get selected count for a resource
  const getResourceSelectedCount = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    return resourcePermissions.filter((permission) =>
      selectedPermissions.includes(permission.id)
    ).length;
  };

  const onSubmit = async (data: AddRolePayload) => {
    setIsSubmitting(true);
    try {
      const response = await addRoleService({
        name: data.name,
        level: Number(data.level) as number,
      });

      if (response.success) {
        toast.success("Role created successfully", {
          description: "The role has been added to your system.",
        });

        // Add permissions to the role if any are selected
        if (selectedPermissions.length > 0) {
          const permissionsResponse = await addRolePermissionsToRoleService(
            response.data?.data?.id as string,
            selectedPermissions.join(",")
          );

          if (permissionsResponse.success) {
            toast.success("Permissions added to role successfully", {
              description: "The permissions have been added to the role.",
            });

            router.refresh();
          } else {
            toast.error(
              permissionsResponse.message ||
                "Failed to add permissions to role. Please try again."
            );
          }
        }

        // Reset form and permissions
        setSelectedPermissions([]);
        setValue("permissions", []);
      } else {
        toast.error(
          response.message || "Failed to create role. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to create role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Create Role
          </Button>
        </SheetTrigger>

        <SheetContent className="!max-w-[704px]">
          <SheetHeader>
            <SheetTitle>Create New Role</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6">
            <div className="flex flex-col gap-6">
              <Input
                label="Role Name"
                placeholder="e.g., Operations Manager"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Level"
                {...register("level")}
                placeholder="Select the level of the role..."
                error={errors.level?.message}
              />
              Permissions
              <div className="space-y-4">
                <Text variant="h6">Permissions</Text>
                {loadingPermissions ? (
                  <div className="flex items-center justify-center py-8">
                    <Icon
                      icon="mdi:loading"
                      className="w-6 h-6 animate-spin text-gray-400"
                    />
                    <Text variant="span" className="ml-2 text-gray-600">
                      Loading permissions...
                    </Text>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(groupedPermissions).map(
                      ([resource, resourcePermissions]) => {
                        const isFullySelected =
                          isResourceFullySelected(resource);
                        const isPartiallySelected =
                          isResourcePartiallySelected(resource);
                        const selectedCount =
                          getResourceSelectedCount(resource);

                        return (
                          <div
                            key={resource}
                            className="border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isFullySelected}
                                  ref={(el) => {
                                    if (el)
                                      el.indeterminate = isPartiallySelected;
                                  }}
                                  onChange={(e) =>
                                    handleResourceChange(
                                      resource,
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <Text
                                  variant="span"
                                  className="font-medium text-gray-900 capitalize"
                                >
                                  {resource}
                                </Text>
                              </div>
                              <div className="flex items-center gap-2">
                                {isFullySelected ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    All Selected
                                  </span>
                                ) : selectedCount > 0 ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {selectedCount} Selected
                                  </span>
                                ) : null}
                                <Icon
                                  icon={
                                    isFullySelected ||
                                    isResourcePartiallySelected(resource)
                                      ? "mdi:chevron-up"
                                      : "mdi:chevron-right"
                                  }
                                  className="w-5 h-5 text-gray-400"
                                />
                              </div>
                            </div>

                            {(isFullySelected ||
                              isResourcePartiallySelected(resource)) && (
                              <div className="border-t border-gray-200 bg-gray-50">
                                <div className="p-3 space-y-2">
                                  {resourcePermissions.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className="flex items-center gap-3"
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center">
                                        <Icon
                                          icon="mdi:subdirectory-arrow-right"
                                          className="w-4 h-4 text-gray-400"
                                        />
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(
                                          permission.id
                                        )}
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            permission.id,
                                            e.target.checked
                                          )
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <Text
                                        variant="span"
                                        className="text-sm text-gray-900 capitalize"
                                      >
                                        {permission.action}
                                      </Text>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
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
                    Creating...
                  </>
                ) : (
                  "Create Role"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
