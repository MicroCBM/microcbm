"use server";
import React from "react";
import {
  OrganizationContent,
  OrganizationFilters,
  //   OrganizationContent,
  OrganizationTable,
  //   OrganizationFilters,
} from "./components";
import { getOrganizationsService } from "@/app/actions";

export default async function OrganizationsPage() {
  const organizations = await getOrganizationsService();
  console.log("organizations", organizations);

  return (
    <main className="flex flex-col gap-4">
      <OrganizationContent />
      <OrganizationFilters />
      <OrganizationTable data={organizations} />
    </main>
  );
}
