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
  const page = Math.max(1, parseInt(String(params?.page ?? 1), 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(String(params?.limit ?? 10), 10) || 10));
  const search = typeof params?.search === "string" ? params.search : "";

  const { data: assets, meta } = await getAssetsService({ page, limit, search });
  const assetsAnalytics = await getAssetsAnalyticsService();
  const sites = (await getSitesService()).data;

  return (
    <main className="flex flex-col gap-4">
      <AssetContent sites={sites} />
      {assetsAnalytics && <AssetSummary assetsAnalytics={assetsAnalytics} />}
      <AssetTable data={assets} meta={meta} />
    </main>
  );
}
