"use server";
import {
  getSitesService,
  getAssetsService,
  getSamplingPointsService,
  getOrganizationsService,
} from "@/app/actions";
import { AddSampleForm } from "./components/AddSampleForm";

export default async function AddSamplePage() {
  const [sitesResult, assetsResult, samplingPointsResult, organizationsResult] =
    await Promise.all([
      getSitesService(),
      getAssetsService(),
      getSamplingPointsService(),
      getOrganizationsService(),
    ]);
  const sites = sitesResult.data;
  const assets = assetsResult.data;
  const samplingPoints = samplingPointsResult.data;
  const organizations = organizationsResult.data;

  return (
    <main className="flex flex-col gap-4">
      <AddSampleForm
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
        organizations={organizations}
      />
    </main>
  );
}
