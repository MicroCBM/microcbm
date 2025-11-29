"use client";

import React from "react";
import { Button } from "@/components";
import { Dropdown } from "@/components/dropdown";
import { useUrlState } from "@/hooks";
import { Asset, SamplingPoint, Sites } from "@/types";
interface USER_TYPE {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
}
export function RecommendationFilters({
  sites,
  assets,
  samplingPoints,
  users,
}: {
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
  users: USER_TYPE[];
}) {
  const [searchSeverity, setSearchSeverity] = useUrlState("severity", "");
  const [site_id, setSearchSiteId] = useUrlState("site_id", "");
  const [asset_id, setSearchAssetId] = useUrlState("asset_id", "");
  const [sampling_point_id, setSearchSamplingPointId] = useUrlState(
    "sampling_point_id",
    ""
  );
  const [recommender_id, setSearchRecommenderId] = useUrlState(
    "recommender_id",
    ""
  );
  const recommendationOptions = [
    {
      label: "All",
      onClickFn: () => setSearchSeverity(""),
    },
    {
      label: "Critical",
      onClickFn: () => setSearchSeverity("active"),
    },
    {
      label: "High",
      onClickFn: () => setSearchSeverity("high"),
    },
    {
      label: "Medium",
      onClickFn: () => setSearchSeverity("medium"),
    },
    {
      label: "Low",
      onClickFn: () => setSearchSeverity("low"),
    },
  ];

  return (
    <section className="flex items-center gap-2">
      <Dropdown
        actions={recommendationOptions}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          as="span"
          size="medium"
          variant="outline"
          icon={"hugeicons:arrow-down-01"}
          iconPosition="right"
        >
          {searchSeverity || "Filter by severity"}
        </Button>
      </Dropdown>
      <Dropdown
        actions={[
          {
            label: "All",
            onClickFn: () => setSearchSiteId(""),
          },
          ...sites.map((site) => ({
            label: site.name,
            onClickFn: () => setSearchSiteId(site.id),
          })),
        ]}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          as="span"
          size="medium"
          variant="outline"
          icon={"hugeicons:arrow-down-01"}
          iconPosition="right"
        >
          {site_id || "Filter by site"}
        </Button>
      </Dropdown>
      <Dropdown
        actions={[
          {
            label: "All",
            onClickFn: () => setSearchAssetId(""),
          },
          ...assets.map((asset) => ({
            label: asset.name,
            onClickFn: () => setSearchAssetId(asset.id),
          })),
        ]}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          as="span"
          size="medium"
          variant="outline"
          icon={"hugeicons:arrow-down-01"}
          iconPosition="right"
        >
          {asset_id || "Filter by asset"}
        </Button>
      </Dropdown>
      <Dropdown
        actions={[
          {
            label: "All",
            onClickFn: () => setSearchSamplingPointId(""),
          },
          ...samplingPoints.map((samplingPoint) => ({
            label: samplingPoint.name,
            onClickFn: () => setSearchSamplingPointId(samplingPoint.id),
          })),
        ]}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          as="span"
          size="medium"
          variant="outline"
          icon={"hugeicons:arrow-down-01"}
          iconPosition="right"
        >
          {sampling_point_id || "Filter by sampling point"}
        </Button>
      </Dropdown>
      <Dropdown
        actions={[
          {
            label: "All",
            onClickFn: () => setSearchRecommenderId(""),
          },
          ...users.map((user) => ({
            label: user.first_name + " " + user.last_name,
            onClickFn: () => setSearchRecommenderId(user.id),
          })),
        ]}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          as="span"
          size="medium"
          variant="outline"
          icon={"hugeicons:arrow-down-01"}
          iconPosition="right"
        >
          {recommender_id || "Filter by recommender"}
        </Button>
      </Dropdown>
    </section>
  );
}
