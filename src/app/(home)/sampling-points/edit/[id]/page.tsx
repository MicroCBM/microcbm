"use server";
import React from "react";
import { notFound } from "next/navigation";
import { EditSamplingPointForm } from "./components";
import {
  getSamplingPointService,
  getAssetsService,
  getSamplingRoutesService,
  getUsersService,
} from "@/app/actions";

interface EditSamplingPointPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSamplingPointPage({
  params,
}: EditSamplingPointPageProps) {
  try {
    const { id } = await params;
    const [samplingPoint, users, samplingRoutes, assets] = await Promise.all([
      getSamplingPointService(id),
      getUsersService(),
      getSamplingRoutesService(),
      getAssetsService(),
    ]);

    if (!samplingPoint) {
      notFound();
    }

    return (
      <main className="flex flex-col gap-4">
        <EditSamplingPointForm
          samplingPoint={samplingPoint}
          users={users}
          sampling_routes={samplingRoutes}
          assets={assets}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data for edit sampling point:", error);
    notFound();
  }
}
