"use server";
import React from "react";
import { AddSamplingPointForm } from "./components";
import {
  getAssetsService,
  getSamplingRoutesService,
  getUsersService,
  getOrganizationsService,
  getSitesService,
} from "@/app/actions";

export default async function AddSamplingPointPage() {
  const [users, samplingRoutes, assets, organizations, sites] =
    await Promise.all([
      getUsersService(),
      getSamplingRoutesService(),
      getAssetsService(),
      getOrganizationsService(),
      getSitesService(),
    ]);

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
