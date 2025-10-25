import React from "react";
import { AddForm } from "./components";
import {
  getAssetsService,
  getSitesService,
  getUsersService,
} from "@/app/actions";

export default async function AddRecommendationPage() {
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const users = await getUsersService();

  return <AddForm sites={sites} assets={assets} users={users} />;
}
