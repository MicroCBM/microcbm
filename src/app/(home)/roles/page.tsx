"use server";
import React from "react";
import {
  getPermissionsByRoleIdService,
  getPermissionsService,
  getRolesService,
} from "@/app/actions";
import { TabsContent } from "./components";

interface RolesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RolesPage({ searchParams }: RolesPageProps) {
  const params = await searchParams;
  const name = typeof params.name === "string" ? params.name : undefined;
  const roleId = typeof params.roleId === "string" ? params.roleId : undefined;

  const roles = await getRolesService({ name });

  // Only fetch permissions if roleId exists
  const rolePermissions = roleId
    ? await getPermissionsByRoleIdService(roleId)
    : null;

  const permissions = await getPermissionsService();
  console.log("data from page permissions", permissions);

  return (
    <main className="flex flex-col gap-4">
      <TabsContent
        roles={roles}
        permissions={permissions}
        rolePermissions={rolePermissions}
        selectedRoleId={roleId || null}
      />
    </main>
  );
}
