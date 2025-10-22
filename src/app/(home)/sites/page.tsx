"use server";
import React from "react";
import { getOrganizationsService, getSitesService } from "@/app/actions";
import { SiteContent, SiteTable } from "./components";

export default async function SitesPage() {
  const sites = await getSitesService();
  const organizations = await getOrganizationsService();

  console.log("sites", sites);

  return (
    <main className="flex flex-col gap-4">
      <SiteContent organizations={organizations} />
      <SiteTable sites={sites} organizations={organizations} />
    </main>
  );
}
