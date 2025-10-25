"use server";
import { SeverityCard, PieChart } from "@/components";

import React from "react";
import { Summary } from "./dashboard";
import LineChart from "./dashboard/components/line-chart/LineChart";
import { CustomTabComp } from "./dashboard/components/custom-tabs";
import { getSitesService } from "../actions/inventory";
import { getAssetsService } from "../actions/inventory";
import { getOrganizationsService } from "../actions/organizations";
import { getSamplingPointsService } from "../actions/sampling-points";

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
  const sites = await getSitesService();
  const assets = await getAssetsService();
  const organizations = await getOrganizationsService();
  const samplingPoints = await getSamplingPointsService();
  // const recommendations = await getRecommendationsService();

  return (
    <main className="flex flex-col gap-4">
      {/* summary section */}
      <Summary />

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
  );
}
