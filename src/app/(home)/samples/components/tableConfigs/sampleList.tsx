"use client";

import { Icon } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  Text,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Asset, CsvHeader, Sample, SamplingPoint, Sites } from "@/types";

interface SampleListColumnsProps<T extends Sample = Sample> {
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
  onViewSample: (sample: T) => void;
  onEditSample: (sample: T) => void;
  onDeleteSample: (sample: T) => void;
}

export function getSampleListColumns<T extends Sample = Sample>({
  sites,
  assets,
  samplingPoints,
  onViewSample,
  onEditSample,
  onDeleteSample,
}: SampleListColumnsProps<T>): ColumnDef<T>[] {
  return [
    {
      accessorKey: "asset",
      header: "Asset",
      cell: ({ row }) => {
        const asset = assets.find(
          (asset: Asset) => asset.id === row.original.asset?.id
        );
        return (
          <span className="text-sm text-gray-900">{asset?.name || "-"}</span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "site",
      header: "Site",
      cell: ({ row }) => {
        const site = sites.find(
          (site: Sites) => site.id === row.original.site?.id
        );
        return (
          <span className="text-sm text-gray-900">{site?.name || "-"}</span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "sampling_point",
      header: "Sampling Point",
      cell: ({ row }) => {
        const samplingPoint = samplingPoints.find(
          (samplingPoint: SamplingPoint) =>
            samplingPoint.id === row.original.sampling_point?.id
        );
        return (
          <span className="text-sm text-gray-900">
            {samplingPoint?.name || "-"}
          </span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "date_sampled",
      header: "Date Sampled",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {dayjs.unix(row.original.date_sampled).format("MMM D, YYYY")}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "lab_name",
      header: "Lab Name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.lab_name}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.severity as "Active" | "Inactive" | "Pending"}
        />
      ),
      size: 120,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="small">
                <Icon
                  icon="mdi:dots-vertical"
                  className="w-4 h-4 text-gray-600"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="px-4 py-2 bg-black text-white">
                <Text variant="span">Select an option</Text>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                  onClick={() => onViewSample(row.original)}
                >
                  View Trend
                </button>
                <button
                  onClick={() => onEditSample(row.original)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Sample
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => onDeleteSample(row.original)}
                >
                  Delete Sample
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      size: 80,
    },
  ];
}

export const sampleListCsvHeaders: Array<CsvHeader> = [
  {
    name: "Serial Number",
    accessor: "serial_number",
  },
  {
    name: "Asset",
    accessor: "asset.name",
  },
  {
    name: "Site",
    accessor: "site.name",
  },
  {
    name: "Sampling Point",
    accessor: "sampling_point.name",
  },
  {
    name: "Date Sampled",
    accessor: "date_sampled",
  },
  {
    name: "Lab Name",
    accessor: "lab_name",
  },
  {
    name: "Severity",
    accessor: "severity",
  },
];
