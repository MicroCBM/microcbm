import React from "react";
import { AddForm } from "./components";
import {
  getAssetsService,
  getSamplingPointsService,
  getSitesService,
  getUsersService,
} from "@/app/actions";

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
