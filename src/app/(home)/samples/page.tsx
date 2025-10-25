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
} from "@/app/actions";

export default async function SamplesPage() {
  const samples = await getSamplesService();
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const samplingPoints = await getSamplingPointsService();
  console.log("samples", samples);

  return (
    <main className="flex flex-col gap-4">
      <SampleContent
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
      <SamplesSummary />
      <SampleFilters />
      <SampleTable data={samples} sites={sites} />
    </main>
  );
}
