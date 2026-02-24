"use server";
import {
  getOrganizationsService,
  getRolesService,
  getSitesService,
  getUsersService,
} from "@/app/actions";
import React from "react";
import { CreateCustomer, UserFilters, UserTable } from "./components";

interface UserManagementPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UserManagementPage({
  searchParams,
}: UserManagementPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );
  const search =
    typeof params?.search === "string" ? params.search : "";
  const status = typeof params?.status === "string" ? params.status : "";
  const role = typeof params?.role === "string" ? params.role : "";
  const site_id = typeof params?.site_id === "string" ? params.site_id : "";
  const organization_id =
    typeof params?.organization_id === "string" ? params.organization_id : "";

  const [users, roles, sitesResult, organizationsResult] = await Promise.all([
    getUsersService({
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
      ...(role && { role }),
      ...(site_id && { site_id }),
      ...(organization_id && { organization_id }),
    }),
    getRolesService(),
    getSitesService(),
    getOrganizationsService(),
  ]);
  const sites = sitesResult.data;
  const organizations = organizationsResult.data;

  return (
    <main className="flex flex-col gap-4">
      <CreateCustomer
        rolesData={roles}
        organizations={organizations}
        sites={sites}
      />
      <UserFilters
        organizations={organizations}
        sites={sites}
        rolesData={roles}
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
