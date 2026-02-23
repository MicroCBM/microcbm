"use server";
import React from "react";
import {
  SampleContent,
  SampleFilters,
  SamplesSummary,
  SampleTable,
} from "./components";
import {
  getSamplesService,
  getSitesService,
  getAssetsService,
  getSamplingPointsService,
  getSamplingPointsAnalyticsService,
} from "@/app/actions";
import { ComponentGuard } from "@/components/content-guard";

interface SamplesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SamplesPage({ searchParams }: SamplesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10));
  const search = typeof params?.search === "string" ? params.search : "";
  const site_id = typeof params?.site_id === "string" ? params.site_id : "";
  const severity = typeof params?.severity === "string" ? params.severity : "";

  const { data: samples, meta } = await getSamplesService({
    page,
    limit,
    search,
    ...(site_id && { site_id }),
    ...(severity && { severity }),
  });
  const sites = (await getSitesService()).data;
  const assets = (await getAssetsService()).data;
  const samplingPoints = (await getSamplingPointsService()).data;
  const samplingPointsAnalytics = await getSamplingPointsAnalyticsService();

  return (
    <main className="flex flex-col gap-4">
      <SampleContent />
      {samplingPointsAnalytics && (
        <ComponentGuard permissions="sampling_points:read">
          <SamplesSummary samplingPointsAnalytics={samplingPointsAnalytics} />
        </ComponentGuard>
      )}
      <SampleFilters sites={sites} />
      <SampleTable
        data={samples}
        meta={meta}
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
    </main>
  );
}
