"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Icon } from "@/libs";
import { cn } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  Text,
} from "@/components";
import { Asset, Sample, SamplingPoint, Sites } from "@/types";
import { DeleteSampleModal } from "./DeleteSampleModal";
import { deleteSampleService } from "@/app/actions";
import { toast } from "sonner";

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
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewSample = (sample: Sample) => {
    router.push(`/samples/view/${sample.id}`);
  };

  const handleEditSample = (id: string) => {
    console.log(id);
    // router.push(`/samples/edit/${sample.id}`);
  };

  const handleDeleteSample = (sample: Sample) => {
    setSelectedSample(sample);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSample(null);
  };

  const handleConfirmDelete = async (sampleId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteSampleService(sampleId);
      if (response.success) {
        toast.success("Sample deleted successfully", {
          description: "The sample has been permanently removed.",
        });
        handleCloseDeleteModal();
        window.location.reload();
      } else {
        toast.error(
          response.message || "Failed to delete sample. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to delete sample. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Sample>[] = [
    // {
    //   id: "serial_number",
    //   header: "Serial Number",
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-3">
    //       <span className="text-sm text-gray-900">
    //         {row.original.serial_number}
    //       </span>
    //     </div>
    //   ),
    //   size: 150,
    // },
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
        {
          const site = sites.find(
            (site: Sites) => site.id === row.original.site?.id
          );
          return (
            <span className="text-sm text-gray-900">{site?.name || "-"}</span>
          );
        }
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
                  onClick={() => handleViewSample(row.original)}
                >
                  View Sample
                </button>
                <button
                  onClick={() => handleEditSample(row.original.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Sample
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => handleDeleteSample(row.original)}
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // If no samples data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("border border-gray-200 overflow-hidden", className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No samples found. Create your first sample to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border border-gray-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleViewSample(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm"
                    onClick={(e) => {
                      if (cell.column.id === "actions") {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteSampleModal
        sample={selectedSample}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
