"use server";
import React from "react";
import {
  OrganizationContent,
  OrganizationFilters,
  //   OrganizationContent,
  OrganizationTable,
  //   OrganizationFilters,
} from "./components";
import {
  getDirectDownloadUrlService,
  getOrganizationsService,
} from "@/app/actions";

export default async function OrganizationsPage() {
  const organizations = await getOrganizationsService();
  const directDownloadUrl = await getDirectDownloadUrlService(
    "organizations",
    "organizations/BlackLogo_1b558bea-8e71-4b80-9a24-9b3d02d86244.png"
  );
  console.log("directDownloadUrl", directDownloadUrl);
  console.log("organizations", organizations);

  return (
    <main className="flex flex-col gap-4">
      <OrganizationContent />
      <OrganizationFilters />
      <OrganizationTable data={organizations} />
    </main>
  );
}
