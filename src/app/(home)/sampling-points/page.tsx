"use server";

import React from "react";
import { SamplingPointContent, SamplingPointTable } from "./components";
import { getSamplingPointsService } from "@/app/actions";

interface SamplingPointsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SamplingPointsPage({
  searchParams,
}: SamplingPointsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );

  const { data: samplingPoints, meta } = await getSamplingPointsService({
    page,
    limit,
  });

  return (
    <main className="flex flex-col gap-4">
      <SamplingPointContent />
      <SamplingPointTable data={samplingPoints} meta={meta} />
    </main>
  );
}
