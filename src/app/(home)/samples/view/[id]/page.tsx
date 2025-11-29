"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSampleService } from "@/app/actions";
import { Sample } from "@/types";
import { toast } from "sonner";
import { SampleAnalyticsView } from "./components/SampleAnalyticsView";
import { Icon } from "@/libs";
import { Text } from "@/components";

export default function ViewSampleAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [sample, setSample] = useState<Sample | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const sampleData = await getSampleService(params.id as string);
        setSample(sampleData);
      } catch (error) {
        console.error("Error fetching sample:", error);
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 border border-gray-200 flex items-center justify-center"
        >
          <Icon icon="mdi:chevron-left" className="size-5" />
        </button>
        <Text variant="h6">Sample Analytics</Text>
      </div>
      <SampleAnalyticsView sample={sample} />
    </main>
  );
}
