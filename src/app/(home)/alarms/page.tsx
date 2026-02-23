"use server";

import React from "react";
import {
  AlarmContent,
  AlarmFilters,
  AlarmsSummery,
  AlarmTable,
} from "./components";
import {
  getAlarmsAnalyticsService,
  getAlarmsService,
  getSitesService,
} from "@/app/actions";

interface AlarmsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AlarmsPage({ searchParams }: AlarmsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );
  const site_id = typeof params?.site_id === "string" ? params.site_id : "";
  const severity = typeof params?.severity === "string" ? params.severity : "";

  const { data: alarms, meta } = await getAlarmsService({
    page,
    limit,
    ...(site_id && { site_id }),
    ...(severity && { severity }),
  });
  const sites = (await getSitesService()).data;
  const alarmsAnalytics = await getAlarmsAnalyticsService();

  return (
    <main className="flex flex-col gap-4">
      <AlarmContent sites={sites} />
      {alarmsAnalytics && <AlarmsSummery alarmsAnalytics={alarmsAnalytics} />}
      <AlarmFilters sites={sites} />
      <AlarmTable data={alarms} meta={meta} sites={sites} />
    </main>
  );
}
