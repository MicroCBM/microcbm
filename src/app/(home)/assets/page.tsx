"use client";
import React, { useState, useEffect } from "react";
import { AssetContent, AssetTable } from "./components";
import { getAssetsService } from "@/app/actions";
import { Asset } from "@/types";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const data = await getAssetsService();
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleAssetDeleted = () => {
    fetchAssets(); // Refresh the assets list
  };

  if (isLoading) {
    return (
      <main className="flex flex-col gap-4">
        <AssetContent />
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading assets...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <AssetContent />
      <AssetTable data={assets} onAssetDeleted={handleAssetDeleted} />
    </main>
  );
}
