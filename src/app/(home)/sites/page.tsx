"use server";
import React from "react";
import {
  getOrganizationsService,
  getSitesAnalyticsService,
  getSitesService,
  getUsersService,
} from "@/app/actions";
import { SiteContent, SiteTable, SiteSummary } from "./components";

export default async function SitesPage() {
  const [sites, organizations, sitesAnalytics, users] = await Promise.all([
    getSitesService(),
    getOrganizationsService(),
    getSitesAnalyticsService(),
    getUsersService(),
  ]);

  return (
    <main className="flex flex-col gap-4">
      <SiteContent organizations={organizations} sites={sites} />
      {sitesAnalytics && <SiteSummary sitesAnalytics={sitesAnalytics} />}
      <SiteTable sites={sites} organizations={organizations} users={users} />
    </main>
  );
}
