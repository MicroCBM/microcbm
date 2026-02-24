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
  const asset_id = typeof params?.asset_id === "string" ? params.asset_id : "";
  const sampling_point_id =
    typeof params?.sampling_point_id === "string"
      ? params.sampling_point_id
      : "";
  const lab_name =
    typeof params?.lab_name === "string" ? params.lab_name : "";

  const { data: samples, meta } = await getSamplesService({
    page,
    limit,
    ...(search && { search }),
    ...(site_id && { site_id }),
    ...(asset_id && { asset_id }),
    ...(sampling_point_id && { sampling_point_id }),
    ...(lab_name && { lab_name }),
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
      <SampleFilters
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
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
