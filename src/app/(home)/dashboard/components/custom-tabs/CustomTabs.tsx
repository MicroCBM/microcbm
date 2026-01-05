"use client";
import { CustomTabs, Text } from "@/components";
import { SiteTable } from "@/app/(home)/sites/components";
import { AssetTable } from "@/app/(home)/assets/components";
import { SamplingPointTable } from "@/app/(home)/sampling-points/components";
import { Asset, Organization, SamplingPoint, Sites } from "@/types";
import { USER_TYPE } from "@/app/actions";
import { useContentGuard } from "@/hooks";
import React from "react";

interface CustomTabCompProps {
  sites: Sites[];
  organizations: Organization[];
  assetsList: Asset[];
  samplingPoints: SamplingPoint[];
  users: USER_TYPE[];
}

export const CustomTabComp = ({
  sites,
  organizations,
  assetsList,
  samplingPoints,
  users,
}: CustomTabCompProps) => {
  // Check permissions for each tab
  const { isAllowed: hasSitesPermission } = useContentGuard("sites:read");
  const { isAllowed: hasAssetsPermission } = useContentGuard("assets:read");
  const { isAllowed: hasSamplingPointsPermission } = useContentGuard(
    "sampling_points:read"
  );

  // Build available tabs based on permissions
  const availableTabs = React.useMemo(() => {
    const tabs = [];
    if (hasSitesPermission) {
      tabs.push({ value: "site", label: "Site" });
    }
    if (hasAssetsPermission) {
      tabs.push({ value: "assets", label: "Assets" });
    }
    if (hasSamplingPointsPermission) {
      tabs.push({ value: "sampling-points", label: "Sampling Points" });
    }
    return tabs;
  }, [hasSitesPermission, hasAssetsPermission, hasSamplingPointsPermission]);

  // Set initial tab to first available tab
  const [selectedTab, setSelectedTab] = React.useState<
    "site" | "assets" | "sampling-points"
  >(() => {
    if (availableTabs.length > 0) {
      return availableTabs[0].value as "site" | "assets" | "sampling-points";
    }
    return "site";
  });

  // Update selected tab if current tab is no longer available
  React.useEffect(() => {
    const tabValues = availableTabs.map((tab) => tab.value);
    if (!tabValues.includes(selectedTab) && availableTabs.length > 0) {
      setSelectedTab(
        availableTabs[0].value as "site" | "assets" | "sampling-points"
      );
    }
  }, [availableTabs, selectedTab]);

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

  // Don't render if no tabs available
  if (availableTabs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <CustomTabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}
          tabs={availableTabs}
        />
        <Text variant="span">
          Total {getTotalCount()} {getLabel()}
        </Text>
      </div>
      {selectedTab === "site" && hasSitesPermission && (
        <SiteTable sites={sites} organizations={organizations} users={users} />
      )}
      {selectedTab === "assets" && hasAssetsPermission && (
        <AssetTable data={assetsList} />
      )}
      {selectedTab === "sampling-points" && hasSamplingPointsPermission && (
        <SamplingPointTable data={samplingPoints} />
      )}
    </div>
  );
};
