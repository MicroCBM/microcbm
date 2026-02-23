import React from "react";
import { ComponentGuard } from "@/components/content-guard";
import {
  getOrganizationsService,
  getSitesService,
  getAssetsService,
  getSamplingPointsService,
} from "@/app/actions";
import { SampleHistoryContent } from "./components";

export const dynamic = "force-dynamic";

export default async function SampleHistoryPage() {
  const [organizations, sites, assets, samplingPoints] = await Promise.all([
    getOrganizationsService().then((r) => r.data).catch(() => []),
    getSitesService().then((r) => r.data).catch(() => []),
    getAssetsService().then((r) => r.data).catch(() => []),
    getSamplingPointsService().then((r) => r.data).catch(() => []),
  ]);

  return (
    <ComponentGuard permissions="samples:read">
      <main className="flex flex-col gap-4">
        <SampleHistoryContent
          organizations={organizations}
          sites={sites}
          assets={assets}
          samplingPoints={samplingPoints}
        />
      </main>
    </ComponentGuard>
  );
}
