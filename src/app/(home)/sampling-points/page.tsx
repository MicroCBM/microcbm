"use server";
import React from "react";
import { SamplingPointContent, SamplingPointTable } from "./components";
import { getSamplingPointsService } from "@/app/actions";

export default async function SamplingPointsPage() {
  const samplingPoints = await getSamplingPointsService();
  console.log("samplingPoints", samplingPoints);

  return (
    <main className="flex flex-col gap-4">
      <SamplingPointContent />
      <SamplingPointTable data={samplingPoints} />
    </main>
  );
}
