"use server";

import React from "react";
import { SamplingRouteContent } from "./components/SamplingRouteContent";
import { SamplingRouteTable } from "./components/SamplingRouteTable";
import { getSamplingRoutesService } from "@/app/actions";

interface SamplingRoutesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SamplingRoutesPage({
  searchParams,
}: SamplingRoutesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10)
  );

  const { data: samplingRoutes, meta } = await getSamplingRoutesService({
    page,
    limit,
  });

  return (
    <main className="flex flex-col gap-4">
      <SamplingRouteContent />
      <SamplingRouteTable data={samplingRoutes} meta={meta} />
    </main>
  );
}
