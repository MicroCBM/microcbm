"use server";

import React from "react";
import { getDepartmentsService } from "@/app/actions";
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

  const { data: departments, meta } = await getDepartmentsService({
    page,
    limit,
  });

  return (
    <main className="flex flex-col gap-4">
      <DepartmentContent />
      <DepartmentFilters />
      <DepartmentTable data={departments} meta={meta} />
    </main>
  );
}
