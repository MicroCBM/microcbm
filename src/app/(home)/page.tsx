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

// Helper function to calculate severity distribution from samples
function calculateSeverityDistribution(samples: Array<{ severity: string }>) {
  const severityMap: Record<string, number> = {
    immediate: 0,
    urgent: 0,
    borderline: 0,
    normal: 0,
  };

  samples.forEach((sample) => {
    const severity = sample.severity?.toLowerCase() || "";
    if (severity === "critical" || severity === "immediate") {
      severityMap.immediate++;
    } else if (severity === "urgent") {
      severityMap.urgent++;
    } else if (severity === "warning" || severity === "borderline") {
      severityMap.borderline++;
    } else if (severity === "normal" || severity === "low") {
      severityMap.normal++;
    }
  });

  return [
    {
      label: "Immediate",
      value: severityMap.immediate,
      color: "#DC2626",
      bgColor: "#FEE2E2",
    },
    {
      label: "Urgent",
      value: severityMap.urgent,
      color: "#EA580C",
      bgColor: "#FED7AA",
    },
    {
      label: "Borderline",
      value: severityMap.borderline,
      color: "#F59E0B",
      bgColor: "#FEF3C7",
    },
    {
      label: "Normal",
      value: severityMap.normal,
      color: "#10B981",
      bgColor: "#D1FAE5",
    },
  ];
}

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

  // Prepare severity card data from real samples
  const samplesArray = Array.isArray(samples) ? samples : [];
  const severityLevels = calculateSeverityDistribution(samplesArray);

  // Get the most recent sample for subtitle and date
  const recentSample = samplesArray.sort(
    (a, b) => (b.date_sampled || 0) - (a.date_sampled || 0)
  )[0];

  // Get the most recent recommendation
  const recentRecommendation =
    Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations.sort(
          (a, b) =>
            new Date(b.created_at_datetime).getTime() -
            new Date(a.created_at_datetime).getTime()
        )[0]
      : null;

  // Prepare severity card data
  const severityCardData = {
    title: "Recent Severity",
    subtitle: recentSample
      ? `Result of sample #${recentSample.serial_number || recentSample.id}`
      : "No samples available",
    date: recentSample
      ? dayjs(recentSample.date_sampled * 1000).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    severityLevels,
    recommendation: recentRecommendation
      ? {
          text:
            recentRecommendation.description || "No recommendation available.",
          author: recentRecommendation.recommender?.name || "Unknown",
          role: "Analyst",
        }
      : {
          text: "No recommendations available at this time.",
          author: "System",
          role: "Analyst",
        },
  };

  // Prepare contaminants data for pie chart
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

        <LineChart samples={samplesArray} />

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
