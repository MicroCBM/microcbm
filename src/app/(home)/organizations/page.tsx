"use server";
import React from "react";
import {
  OrganizationContent,
  OrganizationFilters,
  OrganizationTable,
} from "./components";
import { getOrganizationsService } from "@/app/actions";

export default async function OrganizationsPage() {
  const organizations = await getOrganizationsService();

  return (
    <main className="flex flex-col gap-4">
      <OrganizationContent />
      <OrganizationFilters />
      <OrganizationTable data={organizations} />
    </main>
  );
}
