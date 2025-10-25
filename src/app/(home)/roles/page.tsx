"use server";
import React from "react";
import { getPermissionsService, getRolesService } from "@/app/actions";
import { RoleCards, RoleContent } from "./components";

export default async function RolesPage() {
  const roles = await getRolesService();
  const permissions = await getPermissionsService();
  console.log("roles", roles);
  console.log("permissions", permissions);

  return (
    <main className="flex flex-col gap-4">
      <RoleContent permissionsData={permissions} />
      <RoleCards data={roles} />
    </main>
  );
}
