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
import type { Recommendation } from "@/types";
// import { RecommendationFilters as Filters } from "@/types";
interface RecommendationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function RecommendationsPage({
  searchParams,
}: RecommendationsPageProps) {
  const params = await searchParams;
  const [recommendations, sites, assets, recommendationAnalytics, users, samplingPoints] =
    await Promise.all([
      getRecommendationsService(params).catch(() => [] as Recommendation[]),
      getSitesService().then((r) => r.data).catch(() => []),
      getAssetsService().then((r) => r.data).catch(() => []),
      getRecommendationAnalyticsService().catch(() => []),
      getUsersService().catch(() => []),
      getSamplingPointsService().then((r) => r.data).catch(() => []),
    ]);

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
        users={
          users as Array<{
            id: string;
            first_name: string;
            last_name: string;
            email?: string;
          }>
        }
      />
    </main>
  );
}
