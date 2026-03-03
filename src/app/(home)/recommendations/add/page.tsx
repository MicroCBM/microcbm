import type { Metadata } from "next";
import React from "react";
import { AddForm } from "./components";
import {
  getAssetsService,
  getSamplingPointsService,
  getSitesService,
  getUsersService,
} from "@/app/actions";

export const metadata: Metadata = { title: "Add Recommendation" };
export const dynamic = "force-dynamic";

export default async function AddRecommendationPage() {
  const sites = (await getSitesService()).data;
  const assets = (await getAssetsService()).data;
  const users = await getUsersService();
  const samplingPoints = (await getSamplingPointsService()).data;

  return (
    <AddForm
      sites={sites}
      assets={assets}
      users={users}
      samplingPoints={samplingPoints}
    />
  );
}
