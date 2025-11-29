"use server";
import {
  getSitesService,
  getAssetsService,
  getSamplingPointsService,
} from "@/app/actions";
import { AddSampleForm } from "./components/AddSampleForm";

export default async function AddSamplePage() {
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const samplingPoints = await getSamplingPointsService();

  return (
    <main className="flex flex-col gap-4">
      <AddSampleForm
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
    </main>
  );
}
