import React from "react";
import { AddSamplingPointForm } from "./components";
import {
  getAssetsService,
  getSamplingRoutesService,
  getUsersService,
  getOrganizationsService,
  getSitesService,
} from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AddSamplingPointPage() {
  const [users, samplingRoutesResult, assetsResult, organizationsResult, sitesResult] =
    await Promise.all([
      getUsersService(),
      getSamplingRoutesService(),
      getAssetsService(),
      getOrganizationsService(),
      getSitesService(),
    ]);
  const samplingRoutes = samplingRoutesResult.data;
  const assets = assetsResult.data;
  const organizations = organizationsResult.data;
  const sites = sitesResult.data;

  return (
    <main className="flex flex-col gap-4">
      <AddSamplingPointForm
        users={users}
        sampling_routes={samplingRoutes}
        assets={assets}
        organizations={organizations}
        sites={sites}
      />
    </main>
  );
}
