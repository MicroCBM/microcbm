"use server";
import React from "react";
import {
  getRecommendationService,
  getSitesService,
  getAssetsService,
  getUsersService,
  getSamplingPointsService,
} from "@/app/actions";
import { EditRecommendationForm } from "./components/EditRecommendationForm";

interface EditRecommendationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRecommendationPage({
  params,
}: EditRecommendationPageProps) {
  const { id } = await params;
  const recommendation = await getRecommendationService(id);
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const users = await getUsersService();
  const samplingPoints = await getSamplingPointsService();

  return (
    <main className="flex flex-col gap-4">
      <EditRecommendationForm
        recommendation={recommendation}
        sites={sites}
        assets={assets}
        users={users}
        samplingPoints={samplingPoints}
      />
    </main>
  );
}
