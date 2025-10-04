"use client";
import {
  Text,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  CustomTabs,
  AreaChart,
  DataTable,
  SeverityCard,
  PieChart,
} from "@/components";
import { Icon } from "@/libs";
import React from "react";

const cardData = [
  {
    id: 1,
    title: "Total Assets",
    value: "12,500",
    description: "This is the total value of all your assets.",
    label: "Trending up this month",
    icon: "mdi:trending-up",
  },
  {
    id: 2,
    title: "Total Alarms",
    value: "10",
    description: "This is the total of all your alarms.",
    label: "Trending up this week",
    icon: "mdi:trending-up",
  },
  {
    id: 3,
    title: "Total Alerts",
    value: "10",
    description: "This is the total of all your alerts.",
    label: "Trending up this week",
    icon: "mdi:trending-up",
  },
  {
    id: 4,
    title: "Total Recommendations",
    value: "10",
    description: "This is the total of all your recommendations.",
    label: "Trending up this week",
    icon: "mdi:trending-up",
  },
];

const timeTabs = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
];

const assetsTabs = [
  { value: "site", label: "Site" },
  { value: "assets", label: "Assets" },
  { value: "sampling-points", label: "Sampling Points" },
];

// Sample chart data matching the image pattern
const generateChartData = () => {
  const data = [];
  const startDate = new Date("2024-04-03");

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Generate oscillating pattern with increasing amplitude
    const baseValue1 = 2 + Math.sin(i * 0.3) * 8 + Math.random() * 2;
    const baseValue2 = 5 + Math.sin(i * 0.25 + 1) * 12 + Math.random() * 3;

    data.push({
      date: date.toISOString(),
      series1: Math.max(0, baseValue1),
      series2: Math.max(0, baseValue2),
    });
  }

  return data;
};

// Sample table data matching the image
const tableData = [
  {
    group: "TODAY",
    data: [
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
    ],
  },
  {
    group: "YESTERDAY",
    data: [
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
      {
        siteName: "New Mount",
        location: "New Gbawe Cp",
        nextDue: "2025-01-01",
        activeSPs: 1,
        assetCount: 4,
        status: "Active",
      },
    ],
  },
];

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

export default function Page() {
  const [tabs, setTabs] = React.useState<
    "last-7-days" | "last-30-days" | "last-90-days"
  >("last-7-days");
  const [assets, setAssets] = React.useState<
    "site" | "assets" | "sampling-points"
  >("site");
  return (
    <main className="flex flex-col gap-4">
      {/* summary section */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-100 py-[12.8px] px-[19.8px]"
          >
            <div className="flex items-center justify-between">
              <Text variant="span" className="text-gray">
                {item.title}
              </Text>
              <div className="flex items-center gap-2 border border-gray-100 px-[6.4px] py-[4.8px]">
                <Icon icon="mdi:trending-up" />
                <Text variant="span">{item.value}</Text>
              </div>
            </div>
            <Text variant="h6">{item.value}</Text>
            <div className="flex items-center gap-2 px-[6.4px] py-[4.8px]">
              <Text variant="span">{item.label}</Text>
              <Icon icon="mdi:trending-up" />
            </div>
            <Text variant="span" className="text-gray">
              {item.description}
            </Text>
          </div>
        ))}
      </section>

      {/* chart section */}
      <section className="py-[12.8px] px-[19.8px] border border-gray-100 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Select defaultValue="wear-metals">
            <SelectTrigger>
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wear-metals">Wear Metals</SelectItem>
              <SelectItem value="contaminants">Contamination</SelectItem>
              <SelectItem value="additives-and-lubricants">
                Additives & Lubricants
              </SelectItem>
            </SelectContent>
          </Select>
          <CustomTabs
            value={tabs}
            onValueChange={(value) => setTabs(value as typeof tabs)}
            tabs={timeTabs}
          />
        </div>
        <AreaChart data={generateChartData()} />
      </section>

      {/* table */}
      <section className="pt-[12.8px] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <CustomTabs
            value={assets}
            onValueChange={(value) => setAssets(value as typeof assets)}
            tabs={assetsTabs}
          />
          <Text variant="span">Total 10 Assets</Text>
        </div>
        <DataTable data={tableData} />
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
