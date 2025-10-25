"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { EditSampleForm } from "./components";
import {
  getSampleService,
  getSitesService,
  getAssetsService,
  getSamplingPointsService,
} from "@/app/actions";
import { Sample, Sites, Asset, SamplingPoint } from "@/types";
import { toast } from "sonner";

export default function EditSamplePage() {
  const params = useParams();
  const [sample, setSample] = useState<Sample | null>(null);
  const [sites, setSites] = useState<Sites[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [samplingPoints, setSamplingPoints] = useState<SamplingPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [sampleData, sitesData, assetsData, samplingPointsData] =
          await Promise.all([
            getSampleService(params.id as string),
            getSitesService(),
            getAssetsService(),
            getSamplingPointsService(),
          ]);

        setSample(sampleData);
        setSites(sitesData);
        setAssets(assetsData);
        setSamplingPoints(samplingPointsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch sample details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="flex flex-col gap-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading sample details...</div>
        </div>
      </main>
    );
  }

  if (!sample) {
    return (
      <main className="flex flex-col gap-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Sample not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <EditSampleForm
        sample={sample}
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
      />
    </main>
  );
}
