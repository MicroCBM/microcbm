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
import {
  getAlarmsAnalyticsService,
  getRecommendationAnalyticsService,
} from "../actions";
import { ComponentGuard } from "@/components/content-guard";

// Sample chart data matching the image pattern

// Sample table data matching the image

// Sample severity card data
const severityCardData = {
  title: "Recent Severity",
  subtitle: "Result of sample #123434",
  date: "12-05-2024",
  severityLevels: [
    {
      label: "Immediate",
      value: 15,
      color: "#DC2626", // dark red
      bgColor: "#FEE2E2", // light red
    },
    {
      label: "Urgent",
      value: 15,
      color: "#EA580C", // orange-red
      bgColor: "#FED7AA", // light orange
    },
    {
      label: "Borderline",
      value: 15,
      color: "#F59E0B", // orange
      bgColor: "#FEF3C7", // light yellow
    },
    {
      label: "Normal",
      value: 15,
      color: "#10B981", // green
      bgColor: "#D1FAE5", // light green
    },
  ],
  recommendation: {
    text: "I was skeptical at first, but this product has completely changed my daily routine. The quality is outstanding and it's so easy to use.",
    author: "Sarah J",
    role: "Analyst",
  },
};

// Sample pie chart data for contaminants
const contaminantsData = [
  { name: "Sample", value: 3, color: "#6B7280" }, // medium dark gray
  { name: "Silicon", value: 2, color: "#4B5563" }, // dark gray
  { name: "Potassium", value: 2, color: "#9CA3AF" }, // light gray
  { name: "Water", value: 2, color: "#D1D5DB" }, // very light gray
  { name: "Total Acid", value: 1, color: "#1F2937" }, // very dark gray/black
];

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
  ] = await Promise.all([
    getSitesService().catch(() => []),
    getAssetsService().catch(() => []),
    getAssetsAnalyticsService().catch(() => null),
    getOrganizationsService().catch(() => []),
    getSamplingPointsService().catch(() => []),
    getAlarmsAnalyticsService().catch(() => null),
    getRecommendationAnalyticsService().catch(() => []),
  ]);

  // Extract first recommendation analytics item (or null if empty)
  const recommendationsAnalytics =
    Array.isArray(recommendationsAnalyticsArray) &&
    recommendationsAnalyticsArray.length > 0
      ? recommendationsAnalyticsArray[0]
      : null;

  // const recommendations = await getRecommendationsService();

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

        <LineChart />

        {/* table */}
        <section className="pt-[12.8px] flex flex-col gap-3">
          <CustomTabComp
            sites={sites}
            organizations={organizations}
            assetsList={assets}
            samplingPoints={samplingPoints}
          />
          {/* <DataTable data={tableData} /> */}
        </section>

        {/* cards */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SeverityCard data={severityCardData} />
          <PieChart
            title="Contaminants"
            subtitle="Total for the last 3 months"
            data={contaminantsData}
            centerValue={10}
            centerLabel="Samples"
          />
        </div>
      </main>
    </ComponentGuard>
  );
}
