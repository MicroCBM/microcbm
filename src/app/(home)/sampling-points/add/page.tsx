"use server";
import React from "react";
import { AddSamplingPointForm } from "./components";
import {
  getAssetsService,
  getSamplingRoutesService,
  getUsersService,
} from "@/app/actions";

export default async function AddSamplingPointPage() {
  const users = await getUsersService();
  const samplingRoutes = await getSamplingRoutesService();
  const assets = await getAssetsService();

  return (
    <main className="flex flex-col gap-4">
      <AddSamplingPointForm
        users={users}
        sampling_routes={samplingRoutes}
        assets={assets}
      />
    </main>
  );
}
