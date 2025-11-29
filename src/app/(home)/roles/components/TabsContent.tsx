"use client";
import React from "react";
import { Text, TabbedView } from "@/components";
import { AddRoleModal } from "./AddRoleModal";
import { useUrlState } from "@/hooks";
import { RoleCards } from "./RoleCards";

import { AddPermissionModal } from "./AddPermissionModal";

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
export function TabsContent({
  roles,
  permissions,
  rolePermissions,
  selectedRoleId,
}: Readonly<{
  roles: Role[];
  permissions: Permission[];
  rolePermissions: Permission[] | null;
  selectedRoleId: string | null;
}>) {
  const [tab, setTab] = useUrlState("tab", "roles");

  const tabConfigs = [
    {
      key: "roles" as const,
      component: () => (
        <RoleCards
          data={roles}
          permissions={permissions}
          rolePermissions={rolePermissions}
          selectedRoleId={selectedRoleId}
        />
      ),
      label: "Roles",
    },
    // {
    //   key: "permissions" as const,
    //   component: () => <Permissions data={permissions} />,
    //   label: "Permissions",
    // },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text variant="h6">Roles & Permissions</Text>
        <div className="flex items-center gap-4">
          <AddRoleModal />
          <AddPermissionModal />
        </div>
      </div>

      <TabbedView
        tabs={tabConfigs}
        defaultTab="roles"
        urlParam="tab"
        tabsClassName="gap-6"
        btnClassName="pb-2"
        containerClassName="space-y-4"
        currentTab={tab}
        setCurrentTab={setTab}
      />
    </div>
  );
}
