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

export default async function SamplesPage() {
  const samples = await getSamplesService();
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const samplingPoints = await getSamplingPointsService();
  const samplingPointsAnalytics = await getSamplingPointsAnalyticsService();

  return (
    <main className="flex flex-col gap-4">
      <SampleContent
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
      {samplingPointsAnalytics && (
        <ComponentGuard permissions="sampling_points:read">
          <SamplesSummary samplingPointsAnalytics={samplingPointsAnalytics} />
        </ComponentGuard>
      )}
      <SampleFilters />
      <SampleTable
        data={samples}
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
    </main>
  );
}
