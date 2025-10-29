"use server";
import {
  getOrganizationsService,
  getRolesService,
  getSitesService,
  getUsersService,
} from "@/app/actions";
import React from "react";
import { UserContent, UserTable } from "./components";

export default async function UserManagementPage() {
  const users = await getUsersService();
  const roles = await getRolesService();
  const sites = await getSitesService();
  const organizations = await getOrganizationsService();

  console.log("users table", users);

  return (
    <main className="flex flex-col gap-4">
      <UserContent
        rolesData={roles}
        organizations={organizations}
        sites={sites}
      />
      <UserTable
        data={users}
        rolesData={roles}
        organizations={organizations}
        sites={sites}
      />
    </main>
  );
}
