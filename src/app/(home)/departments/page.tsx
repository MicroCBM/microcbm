"use server";
import React from "react";

import { getDepartmentsService } from "@/app/actions";
import {
  DepartmentContent,
  DepartmentFilters,
  DepartmentTable,
} from "./components";

export default async function DepartmentsPage() {
  const departments = await getDepartmentsService();

  return (
    <main className="flex flex-col gap-4">
      <DepartmentContent />
      <DepartmentFilters />
      <DepartmentTable data={departments} />
    </main>
  );
}
