"use server";
import React from "react";
import { AssetContent, AssetTable, AssetSummary } from "./components";
import {
  getAssetsService,
  getAssetsAnalyticsService,
  getSitesService,
} from "@/app/actions";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const assets = await getAssetsService(params);
  const assetsAnalytics = await getAssetsAnalyticsService();
  const sites = await getSitesService();
  return (
    <main className="flex flex-col gap-4">
      <AssetContent sites={sites} />
      {assetsAnalytics && <AssetSummary assetsAnalytics={assetsAnalytics} />}
      <AssetTable data={assets} />
    </main>
  );
}
