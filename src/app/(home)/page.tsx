"use server";
import { SeverityCard, PieChart } from "@/components";

import React from "react";
import { Summary } from "./dashboard";
import LineChart from "./dashboard/components/line-chart/LineChart";
import { CustomTabComp } from "./dashboard/components/custom-tabs";
import {
  getAssetsAnalyticsService,
  getSitesService,
} from "../actions/inventory";
import { getAssetsService } from "../actions/inventory";
import { getOrganizationsService } from "../actions/organizations";
import { getSamplingPointsService } from "../actions/sampling-points";
import { getUsersService } from "../actions";
import {
  getAlarmsAnalyticsService,
  getRecommendationAnalyticsService,
  getSamplesService,
  getRecommendationsService,
} from "../actions";
import { ComponentGuard } from "@/components/content-guard";
import dayjs from "dayjs";
import { getCurrentUser } from "@/libs/session";

// Helper function to format contaminant names for display
function formatContaminantName(name: string): string {
  // Replace underscores with spaces and capitalize each word
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper function to aggregate contaminants from samples
function aggregateContaminants(
  samples: Array<{ contaminants?: Array<{ type: string; value: number }> }>
) {
  const contaminantMap: Record<string, number> = {};
  // Color palette optimized for data visualization - distinct and accessible
  const colors = [
    "#3B82F6", // Blue - for water/primary elements
    "#10B981", // Green - for natural/organic
    "#F59E0B", // Amber - for warning/moderate
    "#EF4444", // Red - for critical/high
    "#8B5CF6", // Purple - for special compounds
    "#06B6D4", // Cyan - for secondary elements
    "#F97316", // Orange - for additional items
    "#EC4899", // Pink - for rare elements
  ];

  samples.forEach((sample) => {
    if (sample.contaminants && Array.isArray(sample.contaminants)) {
      sample.contaminants.forEach((contaminant) => {
        const type = contaminant.type || "Unknown";
        contaminantMap[type] = (contaminantMap[type] || 0) + 1;
      });
    }
  });

  // Convert to array and sort by value
  const contaminants = Object.entries(contaminantMap)
    .map(([name, value], index) => ({
      name: formatContaminantName(name),
      value,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 contaminants

  return contaminants;
}

export default async function Page() {
  // Get current user
  const currentUser = await getCurrentUser();

  // Fetch all data with error handling - wrap in Promise.all with catch to prevent crashes
  const [
    sites,
    assets,
    assetsAnalytics,
    organizations,
    samplingPoints,
    alarmsAnalytics,
    recommendationsAnalyticsArray,
    samples,
    recommendations,
    users,
  ] = await Promise.all([
    getSitesService().catch(() => []),
    getAssetsService().catch(() => []),
    getAssetsAnalyticsService().catch(() => null),
    getOrganizationsService().catch(() => []),
    getSamplingPointsService().catch(() => []),
    getAlarmsAnalyticsService().catch(() => null),
    getRecommendationAnalyticsService().catch(() => []),
    getSamplesService().catch(() => []),
    getRecommendationsService({}).catch(() => []),
    getUsersService().catch(() => []),
  ]);

  // Extract first recommendation analytics item (or null if empty)
  const recommendationsAnalytics =
    Array.isArray(recommendationsAnalyticsArray) &&
    recommendationsAnalyticsArray.length > 0
      ? recommendationsAnalyticsArray[0]
      : null;

  // Get the most recent recommendation
  const recommendationsArray = Array.isArray(recommendations)
    ? recommendations
    : [];
  const recentRecommendation =
    recommendationsArray.length > 0
      ? recommendationsArray.sort(
          (a, b) =>
            new Date(b.created_at_datetime || 0).getTime() -
            new Date(a.created_at_datetime || 0).getTime()
        )[0]
      : null;

  // Helper function to get recommender name (same logic as RecommendationTable)
  const getRecommenderName = (recommendation: typeof recentRecommendation) => {
    if (!recommendation?.recommender) return "Unknown";

    const recommenderObj = recommendation.recommender;

    // Check if the recommender ID matches the current logged-in user
    if (currentUser?.user_id && recommenderObj?.id === currentUser.user_id) {
      // Try to find the current user in the users array to get their name
      const currentUserInList = users.find(
        (user) => user.id === currentUser.user_id
      );
      if (currentUserInList) {
        const fullName =
          currentUserInList.first_name || currentUserInList.last_name
            ? `${currentUserInList.first_name || ""} ${
                currentUserInList.last_name || ""
              }`.trim()
            : null;
        if (fullName) {
          return `You (${fullName})`;
        }
      }
      return "You";
    }

    // Type guard for recommender with user fields
    type RecommenderWithUserFields = {
      id: string;
      name?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
    };

    const recommenderWithFields = recommenderObj as RecommenderWithUserFields;

    // First, check if recommender object has a name field (from type definition)
    if (recommenderWithFields?.name) {
      return recommenderWithFields.name;
    }

    // Then check if recommender object has first_name or last_name directly
    // (the recommender object might be a full user object embedded)
    if (recommenderWithFields?.first_name || recommenderWithFields?.last_name) {
      const fullName = `${recommenderWithFields.first_name || ""} ${
        recommenderWithFields.last_name || ""
      }`.trim();
      if (fullName) {
        return fullName;
      }
    }

    // Finally, try to find the user in the users array by ID
    if (recommenderObj?.id) {
      const user = users.find((user) => user.id === recommenderObj.id);
      if (user) {
        const fullName =
          user.first_name || user.last_name
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : null;
        if (fullName) {
          return fullName;
        }
        // If no full name, try email from user
        if (user.email) {
          return user.email;
        }
      }
    }

    // Fallback to showing email if available on recommender object
    if (recommenderWithFields?.email) {
      return recommenderWithFields.email;
    }

    // Last resort: return the ID or "Unknown"
    return recommenderObj?.id || "Unknown";
  };

  // Calculate severity distribution from recommendations
  const calculateRecommendationSeverityDistribution = (
    recommendations: typeof recommendationsArray
  ) => {
    const severityMap: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    recommendations.forEach((rec) => {
      const severity = rec.severity?.toLowerCase() || "";
      if (severity in severityMap) {
        severityMap[severity]++;
      }
    });

    return [
      {
        label: "Critical",
        value: severityMap.critical,
        color: "#DC2626",
        bgColor: "#FEE2E2",
      },
      {
        label: "High",
        value: severityMap.high,
        color: "#EA580C",
        bgColor: "#FED7AA",
      },
      {
        label: "Medium",
        value: severityMap.medium,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
      },
      {
        label: "Low",
        value: severityMap.low,
        color: "#10B981",
        bgColor: "#D1FAE5",
      },
    ];
  };

  // Prepare severity card data using recommendation analytics and metrics
  const severityLevels =
    calculateRecommendationSeverityDistribution(recommendationsArray);

  // Use actual recommendations count instead of analytics (which might be outdated)
  const totalRecommendationsCount = recommendationsArray.length;

  // Prepare severity card data
  const severityCardData = {
    title: `Recommendations (${totalRecommendationsCount})`,
    subtitle: recentRecommendation
      ? `Last recommendation: ${recentRecommendation.title || "N/A"}`
      : "No recommendations available",
    date: recentRecommendation
      ? dayjs(recentRecommendation.created_at_datetime).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    severityLevels,
    recommendation: recentRecommendation
      ? {
          text: (() => {
            // Check if description is a placeholder or empty
            const description = recentRecommendation.description?.trim() || "";
            const isPlaceholder =
              description.toLowerCase() === "add recommendation" ||
              description.toLowerCase() === "add recommendation." ||
              description === "";

            // If it's a placeholder or empty, use the title instead
            if (isPlaceholder) {
              return recentRecommendation.title || "No description available.";
            }

            return (
              description ||
              recentRecommendation.title ||
              "No recommendation available."
            );
          })(),
          author: getRecommenderName(recentRecommendation),
          role: "Analyst",
        }
      : {
          text: "No recommendations available at this time.",
          author: "System",
          role: "Analyst",
        },
  };

  // Prepare contaminants data for pie chart
  const samplesArray = Array.isArray(samples) ? samples : [];
  const contaminantsData = aggregateContaminants(samplesArray);
  const totalContaminants = contaminantsData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <ComponentGuard
      permissions="dashboard:read"
      loadingFallback={
        <main className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </main>
      }
      unauthorizedFallback={
        <main className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              You do not have permission to view the dashboard.
            </p>
          </div>
        </main>
      }
    >
      <main className="flex flex-col gap-4">
        {/* summary section */}
        <ComponentGuard permissions="assets:read">
          <Summary
            assetsAnalytics={assetsAnalytics}
            alarmsAnalytics={alarmsAnalytics}
            recommendationsAnalytics={recommendationsAnalytics}
          />
        </ComponentGuard>

        <LineChart samples={Array.isArray(samples) ? samples : []} />

        {/* table */}
        <section className="pt-[12.8px] flex flex-col gap-3">
          <CustomTabComp
            sites={sites}
            organizations={organizations}
            assetsList={assets}
            samplingPoints={samplingPoints}
            users={users}
          />
          {/* <DataTable data={tableData} /> */}
        </section>

        {/* cards */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SeverityCard data={severityCardData} />
          <PieChart
            title="Contaminants"
            subtitle="Total for the last 3 months"
            data={
              contaminantsData.length > 0
                ? contaminantsData
                : [{ name: "No Data", value: 1, color: "#E5E7EB" }]
            }
            centerValue={totalContaminants || 0}
            centerLabel="Samples"
          />
        </div>
      </main>
    </ComponentGuard>
  );
}
