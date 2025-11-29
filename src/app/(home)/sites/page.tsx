"use server";
import React from "react";
import {
  getOrganizationsService,
  getSitesAnalyticsService,
  getSitesService,
} from "@/app/actions";
import { SiteContent, SiteTable, SiteSummary } from "./components";

export default async function SitesPage() {
  const sites = await getSitesService();
  const organizations = await getOrganizationsService();
  const sitesAnalytics = await getSitesAnalyticsService();

  console.log("sites", sites);

  return (
    <main className="flex flex-col gap-4">
      <SiteContent organizations={organizations} sites={sites} />
      <SiteSummary sitesAnalytics={sitesAnalytics} />
      <SiteTable sites={sites} organizations={organizations} />
    </main>
  );
}
