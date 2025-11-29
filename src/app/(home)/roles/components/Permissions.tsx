"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@/components";
import { Checkbox } from "@/components/ui";
import { Icon } from "@/libs";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

function toTitleCase(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Permissions({ data }: { data: Permission[] }) {
  console.log("permissions data", data);
  const groupedPermissions = useMemo(() => {
    const map = new Map<string, Permission[]>();

    data.forEach((permission: Permission) => {
      if (!permission.resource) return;
      if (!map.has(permission.resource)) {
        map.set(permission.resource, []);
      }
      map.get(permission.resource)?.push(permission);
    });

    return Array.from(map.entries())
      .map(([resource, permissions]) => ({
        resource,
        permissions: permissions
          .slice()
          .sort((a, b) => a.action.localeCompare(b.action)),
      }))
      .sort((a, b) => a.resource.localeCompare(b.resource));
  }, [data]);

  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, Set<string>>
  >({});
  const [expandedResources, setExpandedResources] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setSelectedPermissions(() => {
      const initial: Record<string, Set<string>> = {};
      groupedPermissions.forEach(({ resource, permissions }) => {
        initial[resource] = new Set(
          permissions.map((permission) => permission.id)
        );
      });
      return initial;
    });

    setExpandedResources((prev) => {
      const next: Record<string, boolean> = {};
      groupedPermissions.forEach(({ resource }) => {
        next[resource] = resource in prev ? prev[resource] : true;
      });
      return next;
    });
  }, [groupedPermissions]);

  const handleToggleResourceSelection = (resource: string) => {
    const permissionsForResource =
      groupedPermissions.find((group) => group.resource === resource)
        ?.permissions ?? [];

    setSelectedPermissions((prev) => {
      const next: Record<string, Set<string>> = {};
      Object.entries(prev).forEach(([key, value]) => {
        next[key] = new Set(value);
      });

      const currentSet = next[resource] ?? new Set<string>();
      const isAllSelected = currentSet.size === permissionsForResource.length;

      next[resource] = isAllSelected
        ? new Set()
        : new Set(permissionsForResource.map((permission) => permission.id));

      return next;
    });
  };

  const handleToggleSinglePermission = (
    resource: string,
    permissionId: string,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const next: Record<string, Set<string>> = {};
      Object.entries(prev).forEach(([key, value]) => {
        next[key] = new Set(value);
      });

      const current = new Set(next[resource] ?? []);
      if (checked) {
        current.add(permissionId);
      } else {
        current.delete(permissionId);
      }
      next[resource] = current;
      return next;
    });
  };

  const handleToggleExpand = (resource: string) => {
    setExpandedResources((prev) => ({
      ...prev,
      [resource]: !prev[resource],
    }));
  };

  if (groupedPermissions.length === 0) {
    return (
      <div className="py-16 text-center">
        <Text variant="span" className="text-gray-500">
          No permissions found.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Text variant="h6" className="text-gray-900">
          Permissions
        </Text>
        <Text variant="span" className="text-gray-500">
          Review and manage access for this role.
        </Text>
      </div>

      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedPermissions.map(({ resource, permissions }) => {
          const selectedCount =
            selectedPermissions[resource]?.size ?? permissions.length;
          const totalPermissions = permissions.length;
          const allSelected =
            selectedCount === totalPermissions && totalPermissions > 0;
          const hasSomeSelected =
            selectedCount > 0 && selectedCount < totalPermissions;

          const checkedState: CheckedState = allSelected
            ? true
            : hasSomeSelected
            ? "indeterminate"
            : false;

          const isExpanded = expandedResources[resource] ?? true;

          return (
            <div
              key={resource}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4 px-4 py-3">
                <Checkbox
                  checked={checkedState}
                  onCheckedChange={() =>
                    handleToggleResourceSelection(resource)
                  }
                  className="size-5"
                />
                <div className="flex flex-1 items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={
                        allSelected
                          ? "hugeicons:checkmark-square-03"
                          : hasSomeSelected
                          ? "hugeicons:minus-square"
                          : "hugeicons:square"
                      }
                      className="size-5 text-gray-500"
                    />
                    <Text variant="span" className="text-gray-900 font-medium">
                      {toTitleCase(resource)}
                    </Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        allSelected
                          ? "bg-emerald-50 text-emerald-600"
                          : hasSomeSelected
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {allSelected
                        ? "All Selected"
                        : hasSomeSelected
                        ? `${selectedCount} Selected`
                        : "None Selected"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(resource)}
                      className="flex items-center justify-center rounded-full border border-transparent p-2 text-gray-500 transition hover:border-gray-200 hover:bg-gray-50"
                      aria-label={`${
                        isExpanded ? "Collapse" : "Expand"
                      } ${resource} permissions`}
                    >
                      <Icon
                        icon={
                          isExpanded
                            ? "hugeicons:chevron-up-small"
                            : "hugeicons:chevron-down-small"
                        }
                        className="size-4"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <ul className="space-y-3">
                    {permissions.map((permission) => {
                      const isSelected =
                        selectedPermissions[resource]?.has(permission.id) ??
                        true;

                      return (
                        <li
                          key={permission.id}
                          className="flex items-start gap-3 rounded-md bg-white px-4 py-3 shadow-xs"
                        >
                          <div className="pt-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleToggleSinglePermission(
                                  resource,
                                  permission.id,
                                  checked === true
                                )
                              }
                              className="size-[18px]"
                            />
                          </div>
                          <div className="flex flex-col">
                            <Text
                              variant="span"
                              className="font-medium text-gray-900"
                            >
                              {permission.name
                                ? permission.name
                                : toTitleCase(permission.action)}
                            </Text>
                            <Text
                              variant="span"
                              className="text-xs text-gray-500"
                            >
                              {toTitleCase(permission.action)} access
                            </Text>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
