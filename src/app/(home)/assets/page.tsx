"use server";
import React from "react";
import { AssetContent, AssetTable } from "./components";
import { getAssetsService } from "@/app/actions";

export default async function AssetsPage() {
  const assets = await getAssetsService();

  return (
    <main className="flex flex-col gap-4">
      <AssetContent />
      <AssetTable data={assets} />
    </main>
  );
}
