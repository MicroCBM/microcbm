"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { EditSamplingPointForm } from "./components";
import { getSamplingPointService } from "@/app/actions";
import { SamplingPoint } from "@/types";
import { toast } from "sonner";

export default function EditSamplingPointPage() {
  const params = useParams();
  const [samplingPoint, setSamplingPoint] = useState<SamplingPoint | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSamplingPoint = async () => {
      try {
        setIsLoading(true);
        const data = await getSamplingPointService(params.id as string);
        setSamplingPoint(data);
      } catch (error) {
        console.error("Error fetching sampling point:", error);
        toast.error("Failed to fetch sampling point details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSamplingPoint();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="flex flex-col gap-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading sampling point details...</div>
        </div>
      </main>
    );
  }

  if (!samplingPoint) {
    return (
      <main className="flex flex-col gap-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Sampling point not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <EditSamplingPointForm samplingPoint={samplingPoint} />
    </main>
  );
}
