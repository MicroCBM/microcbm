"use server";
import React from "react";
import {
  RecommendationContent,
  // RecommendationFilters,
  // RecommendationsSummary,
  RecommendationTable,
} from "./components";
import {
  getRecommendationsService,
  getSitesService,
  getAssetsService,
} from "@/app/actions";
// import { RecommendationFilters as Filters } from "@/types";

export default async function RecommendationsPage() {
  const recommendations = await getRecommendationsService();
  const sites = await getSitesService();
  const assets = await getAssetsService();

  console.log("recommendations", recommendations);

  return (
    <main className="flex flex-col gap-4">
      <RecommendationContent />
      {/* <RecommendationsSummary recommendations={recommendations} /> */}
      {/* <RecommendationFilters
        filters={{} as Filters}
        onFiltersChange={() => {}}
        onClearFilters={() => {}}
        sites={sites}
        assets={assets}
        recommenders={[]}
      /> */}
      <RecommendationTable
        data={recommendations}
        sites={sites}
        assets={assets}
      />
    </main>
  );
}
