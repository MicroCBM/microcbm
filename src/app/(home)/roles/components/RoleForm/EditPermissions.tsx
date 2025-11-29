"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  Text,
  SheetFooter,
  Button,
} from "@/components";

import { PermissionGroup } from "./PermissionGroup";
import {
  ADD_PERMISSIONS_TO_ROLE_SCHEMA,
  AddPermissionsToRolePayload,
} from "@/schema/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPermissionsToRoleService } from "@/app/actions";
import { toast } from "sonner";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

export function EditPermissions({
  data,
  permissions,
  isOpen,
  onClose,
  roleId,
}: {
  data: Permission[] | null | undefined;
  permissions: Permission[] | null;
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
}) {
  console.log("permissions", permissions);
  // Create a mock form for PermissionGroup (read-only)
  const form = useForm<AddPermissionsToRolePayload>({
    resolver: zodResolver(ADD_PERMISSIONS_TO_ROLE_SCHEMA),
    defaultValues: {
      permission_ids: [],
    },
  });

  const { setValue } = form;

  // Transform permissions data into the format PermissionGroup expects
  const { groupedPermissions } = useMemo(() => {
    // Handle case where there are no permissions in the system
    if (
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      return { groupedPermissions: [], permissionsDict: {} };
    }

    // Create a Set of assigned permission IDs for quick lookup
    const assignedPermissionIds = new Set<string>();
    if (data && Array.isArray(data) && data.length > 0) {
      console.log("ViewPermissions - data (assigned permissions):", data);
      data.forEach((permission) => {
        if (permission.id) {
          assignedPermissionIds.add(permission.id);
          console.log("Added to assigned set:", permission.id);
        }
      });
    } else {
      console.log("ViewPermissions - data is empty/null:", data);
    }

    // Group ALL permissions by resource (not just assigned ones)
    const map = new Map<string, Permission[]>();

    // Group all system permissions by resource
    permissions.forEach((permission) => {
      if (!permission.resource) return;
      if (!map.has(permission.resource)) {
        map.set(permission.resource, []);
      }
      map.get(permission.resource)?.push(permission);

      // Check if this permission is assigned to the role
      const isAssigned = assignedPermissionIds.has(permission.id);

      // Debug logging for alarms permissions
      if (permission.resource === "alarms") {
        console.log(
          `Alarms permission "${permission.id}": isAssigned=${isAssigned}`
        );
      }
    });

    // Transform to PermissionGroup format
    const groupedPermissions = Array.from(map.entries())
      .map(([resource, permissionList]) => {
        // Transform permissions array to Record<string, string> format
        // Key: action, Value: permission ID
        const permissionsRecord: Record<string, string> = {};
        permissionList.forEach((permission) => {
          permissionsRecord[permission.action] = permission.id;
        });

        return {
          resource,
          permissions: permissionsRecord,
        };
      })
      .sort((a, b) => a.resource.localeCompare(b.resource));

    return { groupedPermissions };
  }, [permissions, data]);

  // Set only assigned permissions in form (initial value)
  useMemo(() => {
    if (!data || !Array.isArray(data)) return;
    const assignedIds = data.map((p) => p.id).filter(Boolean);
    setValue("permission_ids", assignedIds);
  }, [data, setValue]);

  const handleSubmit = async (data: AddPermissionsToRolePayload) => {
    try {
      const response = await addPermissionsToRoleService(
        roleId,
        data.permission_ids
      );
      if (response.success) {
        toast.success("Permissions added to role successfully", {
          description: "The permissions have been added to the role.",
        });
      } else {
        toast.error(response.message || "Failed to add permissions to role.");
      }
    } catch (error) {
      console.error("Error adding permissions to role:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[840px]">
        <SheetHeader>
          <SheetTitle>Edit Permissions</SheetTitle>
          <SheetDescription>
            View all permissions assigned to this role.
          </SheetDescription>
        </SheetHeader>
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          <form
            id="edit-permissions-form"
            className="grid gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {groupedPermissions.length === 0 ? (
              <div className="py-12 text-center">
                <Text variant="span" className="text-gray-500">
                  This role has no permissions assigned.
                </Text>
              </div>
            ) : (
              <>
                <Text variant="span" className="text-gray-500">
                  Permissions
                </Text>
                <ul className="grid gap-3">
                  {groupedPermissions.map(({ resource, permissions }) => (
                    <div key={resource}>
                      <PermissionGroup
                        key={resource}
                        groupName={resource}
                        permissions={permissions}
                        form={form}
                      />
                      <hr className="border-gray-200 w-[calc(100%-2rem)] mt-2.5 ml-auto" />
                    </div>
                  ))}
                </ul>
              </>
            )}
          </form>
        </div>
        <SheetFooter>
          <Button type="submit" form="edit-permissions-form">
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
