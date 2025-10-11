"use client";

import { Text, CustomTabs, SeverityCard, PieChart } from "@/components";
import { Icon } from "@/libs";
import React from "react";

// Summary cards data
const summaryCards = [
  {
    id: 1,
    title: "Total Recommendations",
    value: "1,250",
    description: "Visitors for the last 6 months",
    label: "Trending up this month",
    trend: "12.5%",
    icon: "mdi:trending-up",
  },
  {
    id: 2,
    title: "Overdue Recommendations",
    value: "1,250",
    description: "Past due date",
    label: "Trending down this month",
    trend: "12.5%",
    icon: "mdi:trending-down",
  },
  {
    id: 3,
    title: "Open Recommendations",
    value: "1,250",
    description: "Requiring action",
    label: "Trending down this month",
    trend: "12.5%",
    icon: "mdi:trending-down",
  },
];

// Bar chart data for recommendations over time
const barChartData = [
  { month: "January", value: 220 },
  { month: "February", value: 300 },
  { month: "March", value: 240 },
  { month: "April", value: 290 },
  { month: "May", value: 140 },
  { month: "June", value: 220 },
];

// Severity data
const severityData = {
  title: "Severity",
  subtitle: "Total for the last 3 months",
  date: "2024-05-12",
  severityLevels: [
    {
      label: "Critical",
      value: 15,
      color: "#DC2626", // red
      bgColor: "#FEE2E2",
    },
    {
      label: "Urgent",
      value: 15,
      color: "#EA580C", // orange
      bgColor: "#FED7AA",
    },
    {
      label: "Border",
      value: 15,
      color: "#F59E0B", // yellow
      bgColor: "#FEF3C7",
    },
    {
      label: "Normal",
      value: 15,
      color: "#10B981", // green
      bgColor: "#D1FAE5",
    },
  ],
  recommendation: {
    text: "I was skeptical at first, but this product has completely changed my daily routine. The quality is outstanding and it's so easy to use.",
    author: "Sarah J",
    role: "Analyst",
  },
};

// Pie chart data for recommendation trends
const recommendationTrendData = [
  { name: "Open", value: 3, color: "#1F2937" }, // black
  { name: "Overdue", value: 2, color: "#4B5563" }, // dark gray
  { name: "Critical", value: 2, color: "#6B7280" }, // medium gray
  { name: "Completed", value: 2, color: "#9CA3AF" }, // light gray
  { name: "Total", value: 1, color: "#D1D5DB" }, // very light gray
];

// Recommendations list data
const recommendationsList = [
  {
    id: 1,
    plant: "Plant A",
    description:
      "High Iron Content - Immediate Action Required: Ghana Oil Company - Iron levels at 145 ppm exceed critical threshold...",
    tags: ["Lab_Report_CMP...", "Compressor_Pho...", "Trend_Analysis_Iron..."],
    status: "Normal",
    time: "11:53 AM",
  },
  {
    id: 2,
    plant: "Plant B",
    description:
      "Low Viscosity Alert - Monitor Closely: Sample analysis shows viscosity below recommended levels...",
    tags: ["Viscosity_Test_2024", "Equipment_Check"],
    status: "Caution",
    time: "10:30 AM",
  },
  {
    id: 3,
    plant: "Plant C",
    description:
      "Contamination Detected - Review Required: Water contamination levels require immediate attention...",
    tags: ["Water_Analysis", "Contamination_Report"],
    status: null,
    time: "09:15 AM",
  },
];

// Filter tabs
const filterTabs = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "completed", label: "Completed" },
  { value: "caution", label: "Caution" },
];

export default function RecommendationPage() {
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [timePeriod, setTimePeriod] = React.useState("last-3-months");

  return (
    <main className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text variant="h4" className="font-bold text-gray-900">
          Recommendation
        </Text>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          <Icon icon="mdi:plus" className="w-4 h-4" />
          Add Recommendation
        </button>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div key={card.id} className="border border-gray-200 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Text variant="span" className="text-gray-500 text-sm">
                {card.title}
              </Text>
              <div className="flex items-center gap-2 border border-gray-200 px-2 py-1 rounded">
                <Icon icon={card.icon} className="w-4 h-4" />
                <Text variant="span" className="text-sm">
                  {card.trend}
                </Text>
              </div>
            </div>
            <Text variant="h4" className="font-bold text-gray-900 mb-2">
              {card.value}
            </Text>
            <div className="flex items-center gap-2 mb-2">
              <Text variant="span" className="text-sm text-gray-600">
                {card.label}
              </Text>
              <Icon icon={card.icon} className="w-4 h-4" />
            </div>
            <Text variant="span" className="text-sm text-gray-500">
              {card.description}
            </Text>
          </div>
        ))}
      </section>

      {/* Bar Chart Section */}
      <section className="border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text variant="h6" className="font-semibold text-gray-900 mb-1">
              Total Recommendations
            </Text>
            <Text variant="span" className="text-sm text-gray-500">
              Total for the last 3 months
            </Text>
          </div>
          <CustomTabs
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value)}
            tabs={[
              { value: "last-3-months", label: "Last 3 months" },
              { value: "last-30-days", label: "Last 30 days" },
              { value: "last-7-days", label: "Last 7 days" },
            ]}
          />
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2">
          {barChartData.map((item, index) => (
            <div key={item.month} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-black rounded-t"
                style={{ height: `${(item.value / 300) * 200}px` }}
              />
              <Text variant="span" className="text-xs text-gray-600 mt-2">
                {item.month.slice(0, 3)}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Severity & Recommendation */}
        <div className="space-y-6">
          <SeverityCard data={severityData} />
        </div>

        {/* Right Column - Recommendation Trend Pie Chart */}
        <div>
          <PieChart
            title="Recommendation Trend"
            subtitle="Total for the last 3 months"
            data={recommendationTrendData}
            centerValue={10}
            centerLabel="Samples"
          />
        </div>
      </div>

      {/* Recommendations List Section */}
      <section className="border border-gray-200 rounded-lg">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search recommendation"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Icon
                icon="mdi:magnify"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
            </div>
            <CustomTabs
              value={activeFilter}
              onValueChange={(value) => setActiveFilter(value)}
              tabs={filterTabs}
            />
          </div>
        </div>

        {/* Recommendations List */}
        <div className="p-6">
          <div className="space-y-4">
            {recommendationsList.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Icon
                  icon="mdi:star-outline"
                  className="w-5 h-5 text-gray-400 mt-1"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Text variant="span" className="font-medium text-gray-900">
                      {item.plant}
                    </Text>
                    {item.status && (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Normal"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>

                  <Text
                    variant="span"
                    className="text-sm text-gray-700 block mb-2"
                  >
                    {item.description}
                  </Text>

                  <div className="flex items-center gap-2 flex-wrap">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Text variant="span" className="text-sm text-gray-500">
                  {item.time}
                </Text>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <Text variant="span" className="text-sm text-gray-600">
              Total 10 items
            </Text>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
