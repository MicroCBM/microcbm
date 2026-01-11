"use client";

import { cn } from "@/libs";
import { PaginatedTable, Text } from "@/components";
import { Asset, Sample, SamplingPoint, Sites } from "@/types";
import { DeleteSampleModal } from "./modals";
import { getSampleListColumns, sampleListCsvHeaders } from "./tableConfigs";
import { useSampleManagementBase } from "../hooks";
import { MODALS } from "@/utils/constants/modals";
import { useRouter } from "next/navigation";

interface SampleTableProps {
  data: Sample[];
  className?: string;
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}

export function SampleTable({
  data,
  className,
  assets,
  sites,
  samplingPoints,
}: SampleTableProps) {
  const router = useRouter();
  const { modal, query, setQuery } = useSampleManagementBase();

  const handleViewSample = (sample: Sample) => {
    // For samples, we navigate to the view page instead of opening a modal
    router.push(`/samples/view/${sample.id}`);
  };

  const handleEditSample = (sample: Sample) => {
    // Navigate to edit page
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
          Samples ({data?.length ?? 0})
        </Text>
      </div>
      <PaginatedTable<Sample>
        filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
        columns={sampleListColumns}
        data={data}
        query={query}
        setQuery={setQuery}
        total={data?.length ?? 0}
        loading={false}
        csvHeaders={sampleListCsvHeaders}
        searchPlaceholder="Search samples"
        noExport
      />

      <DeleteSampleModal />
    </div>
  );
}
