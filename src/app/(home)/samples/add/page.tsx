"use server";
import {
  getSitesService,
  getAssetsService,
  getSamplingPointsService,
  getOrganizationsService,
} from "@/app/actions";
import { AddSampleForm } from "./components/AddSampleForm";

export default async function AddSamplePage() {
  const [sites, assets, samplingPoints, organizations] = await Promise.all([
    getSitesService(),
    getAssetsService(),
    getSamplingPointsService(),
    getOrganizationsService(),
  ]);

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
