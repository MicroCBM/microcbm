"use server";

import React from "react";
import {
  getOrganizationsService,
  getSitesAnalyticsService,
  getSitesService,
  getUsersService,
} from "@/app/actions";
import { SiteContent, SiteTable, SiteSummary } from "./components";

interface SitesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SitesPage({ searchParams }: SitesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );

  const [sitesResult, organizationsResult, sitesAnalytics, users] =
    await Promise.all([
      getSitesService({ page, limit }),
      getOrganizationsService(),
      getSitesAnalyticsService(),
      getUsersService(),
    ]);
  const sites = sitesResult.data;
  const organizations = organizationsResult.data;

  return (
    <main className="flex flex-col gap-4">
      <SiteContent organizations={organizations} sites={sites} />
      {sitesAnalytics && <SiteSummary sitesAnalytics={sitesAnalytics} />}
      <SiteTable
        sites={sites}
        organizations={organizations}
        users={users}
        meta={sitesResult.meta}
      />
    </main>
  );
}
