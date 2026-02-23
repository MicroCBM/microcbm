"use client";

import React, { useMemo } from "react";
import { cn } from "@/libs";
import { PaginatedTable, Text } from "@/components";
import { Asset, Sample, SamplingPoint, Sites } from "@/types";
import { DeleteSampleModal } from "./modals";
import { getSampleListColumns, sampleListCsvHeaders } from "./tableConfigs";
import { useSampleManagementBase } from "../hooks";
import { MODALS } from "@/utils/constants/modals";
import { useRouter, useSearchParams } from "next/navigation";
import type { SamplesMeta } from "@/app/actions/samples";

interface SampleTableProps {
  data: Sample[];
  meta: SamplesMeta;
  className?: string;
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}

export function SampleTable({
  data,
  meta,
  className,
  assets,
  sites,
  samplingPoints,
}: SampleTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, query, setQuery } = useSampleManagementBase();

  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limitFromUrl = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") ?? "10", 10) || 10));
  const searchFromUrl = searchParams.get("search") ?? "";
  const site_id = searchParams.get("site_id") ?? "";
  const severity = searchParams.get("severity") ?? "";

  const querySyncedWithUrl = useMemo(
    () => ({
      ...query,
      page: pageFromUrl,
      limit: limitFromUrl,
      search: searchFromUrl,
    }),
    [query, pageFromUrl, limitFromUrl, searchFromUrl]
  );

  const setQueryAndNavigate = (nextQuery: typeof query) => {
    const params = new URLSearchParams();
    const page = Number(nextQuery.page) || 1;
    const limit = Number(nextQuery.limit) || 10;
    const search = String(nextQuery.search ?? "").trim();
    if (page !== 1) params.set("page", String(page));
    if (limit !== 10) params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (site_id) params.set("site_id", site_id);
    if (severity) params.set("severity", severity);
    const q = params.toString();
    router.push(`/samples${q ? `?${q}` : ""}`);
    setQuery(nextQuery);
  };

  const handleViewSample = (sample: Sample) => {
    router.push(`/samples/view/${sample.id}`);
  };

  const handleEditSample = (sample: Sample) => {
    router.push(`/samples/edit/${sample.id}`);
  };

  const handleDeleteSample = (sample: Sample) => {
    modal.openModal(MODALS.SAMPLE.CHILDREN.DELETE, { sample });
  };

  const sampleListColumns = getSampleListColumns({
    sites,
    assets,
    samplingPoints,
    onViewSample: handleViewSample,
    onEditSample: handleEditSample,
    onDeleteSample: handleDeleteSample,
  });

  return (
    <div className={cn("relative space-y-[37px]", className)}>
      <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
        <Text variant="h6" weight="medium">
          Sample Reports ({meta.total})
        </Text>
      </div>
      <PaginatedTable<Sample>
        filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
        columns={sampleListColumns}
        data={data ?? []}
        query={querySyncedWithUrl}
        setQuery={setQueryAndNavigate}
        total={meta.total}
        loading={false}
        csvHeaders={sampleListCsvHeaders}
        searchPlaceholder="Search sample reports"
        noExport
        noSearch
      />

      <DeleteSampleModal />
    </div>
  );
}
