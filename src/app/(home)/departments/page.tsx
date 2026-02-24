"use server";

import React from "react";
import { getDepartmentsService, getOrganizationsService } from "@/app/actions";
import {
  DepartmentContent,
  DepartmentFilters,
  DepartmentTable,
} from "./components";

interface DepartmentsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DepartmentsPage({
  searchParams,
}: DepartmentsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );
  const search =
    typeof params?.search === "string" ? params.search : "";
  const organization_id =
    typeof params?.organization_id === "string" ? params.organization_id : "";

  const [{ data: departments, meta }, organizationsResult] = await Promise.all([
    getDepartmentsService({
      page,
      limit,
      ...(search && { search }),
      ...(organization_id && { organization_id }),
    }),
    getOrganizationsService(),
  ]);
  const organizations = organizationsResult.data;

  return (
    <main className="flex flex-col gap-4">
      <DepartmentContent />
      <DepartmentFilters organizations={organizations} />
      <DepartmentTable data={departments} meta={meta} />
    </main>
  );
}
