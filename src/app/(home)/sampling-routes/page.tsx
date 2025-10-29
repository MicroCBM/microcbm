"use server";
import React from "react";
import { SamplingRouteContent } from "./components/SamplingRouteContent";
import { SamplingRouteTable } from "./components/SamplingRouteTable";
import { getSamplingRoutesService } from "@/app/actions";

export default async function SamplingRoutesPage() {
  const samplingRoutes = await getSamplingRoutesService();
  console.log("samplingRoutes", samplingRoutes);

  return (
    <main className="flex flex-col gap-4">
      <SamplingRouteContent />
      <SamplingRouteTable data={samplingRoutes} />
    </main>
  );
}
