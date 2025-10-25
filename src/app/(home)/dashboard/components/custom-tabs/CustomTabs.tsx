"use client";
import { CustomTabs, Text } from "@/components";
import { SiteTable } from "@/app/(home)/sites/components";
import { AssetTable } from "@/app/(home)/assets/components";
import { SamplingPointTable } from "@/app/(home)/sampling-points/components";
import { Asset, Organization, SamplingPoint, Sites } from "@/types";
import React from "react";

const assetsTabs = [
  { value: "site", label: "Site" },
  { value: "assets", label: "Assets" },
  { value: "sampling-points", label: "Sampling Points" },
];

interface CustomTabCompProps {
  sites: Sites[];
  organizations: Organization[];
  assetsList: Asset[];
  samplingPoints: SamplingPoint[];
}

export const CustomTabComp = ({
  sites,
  organizations,
  assetsList,
  samplingPoints,
}: CustomTabCompProps) => {
  const [selectedTab, setSelectedTab] = React.useState<
    "site" | "assets" | "sampling-points"
  >("site");

  const getTotalCount = () => {
    switch (selectedTab) {
      case "site":
        return sites.length;
      case "assets":
        return assetsList.length;
      case "sampling-points":
        return samplingPoints?.length || 0;
    }
  };

  const getLabel = () => {
    switch (selectedTab) {
      case "site":
        return "Sites";
      case "assets":
        return "Assets";
      case "sampling-points":
        return "Sampling Points";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <CustomTabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}
          tabs={assetsTabs}
        />
        <Text variant="span">
          Total {getTotalCount()} {getLabel()}
        </Text>
      </div>
      {selectedTab === "site" && (
        <SiteTable sites={sites} organizations={organizations} />
      )}
      {selectedTab === "assets" && <AssetTable data={assetsList} />}
      {selectedTab === "sampling-points" && (
        <SamplingPointTable data={samplingPoints} />
      )}
    </div>
  );
};
