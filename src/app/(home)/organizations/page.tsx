"use server";

import React from "react";
import {
  OrganizationContent,
  OrganizationFilters,
  OrganizationTable,
} from "./components";
import { getOrganizationsService } from "@/app/actions";

interface OrganizationsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrganizationsPage({
  searchParams,
}: OrganizationsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );

  const { data: organizations, meta } = await getOrganizationsService({
    page,
    limit,
  });

  return (
    <main className="flex flex-col gap-4">
      <OrganizationContent />
      <OrganizationFilters />
      <OrganizationTable data={organizations} meta={meta} />
    </main>
  );
}
