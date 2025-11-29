"use server";
import React from "react";
import {
  RecommendationContent,
  RecommendationFilters,
  RecommendationsSummary,
  RecommendationTable,
  RecommendationTrend,
} from "./components";
import {
  getRecommendationsService,
  getSitesService,
  getAssetsService,
  getRecommendationAnalyticsService,
  getUsersService,
  getSamplingPointsService,
} from "@/app/actions";
// import { RecommendationFilters as Filters } from "@/types";
interface RecommendationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function RecommendationsPage({
  searchParams,
}: RecommendationsPageProps) {
  const params = await searchParams;
  const recommendations = await getRecommendationsService(params);
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const recommendationAnalytics = await getRecommendationAnalyticsService();
  const users = await getUsersService();
  const samplingPoints = await getSamplingPointsService();

  return (
    <main className="flex flex-col gap-4">
      <RecommendationContent />
      <RecommendationsSummary
        recommendationAnalytics={recommendationAnalytics}
      />
      <RecommendationTrend recommendations={recommendations} />
      <RecommendationFilters
        sites={sites}
        assets={assets}
        samplingPoints={samplingPoints}
        users={users}
      />
      <RecommendationTable
        data={recommendations}
        sites={sites}
        assets={assets}
        users={users}
      />
    </main>
  );
}
