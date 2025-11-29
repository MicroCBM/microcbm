"use client";

import React from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  StatusBadge,
  Text,
} from "@/components";

import { Asset } from "@/types";
import dayjs from "dayjs";
import { usePresignedUrl } from "@/hooks";

interface ViewAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewAssetModal = ({
  asset,
  isOpen,
  onClose,
}: ViewAssetModalProps) => {
  const datasheetFileKey = asset?.datasheet?.file_url;
  const {
    url: datasheetUrl,
    isLoading: isDatasheetLoading,
    error: datasheetError,
  } = usePresignedUrl(datasheetFileKey, isOpen && !!datasheetFileKey);
  console.log("datasheetUrl", datasheetUrl);

  if (!asset) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD-MM-YYYY");
  };

  console.log("asset", asset);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[1440px]">
        <SheetHeader>
          <SheetTitle>View Asset</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 h-screen overflow-y-auto">
          {/* Assignee Details */}
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <Text
                variant="span"
                weight="medium"
                className="text-gray-700 text-sm"
              >
                Assignee
              </Text>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Name
                </Text>
                <Text variant="p" className="text-gray-900 font-medium">
                  {asset.assignee.first_name} {asset.assignee.last_name}
                </Text>
              </div>

              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Role
                </Text>
                <div className="mt-1">
                  {asset.assignee.role.charAt(0).toUpperCase() +
                    asset.assignee.role.slice(1).toLowerCase()}
                </div>
              </div>

              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Status
                </Text>
                <div className="mt-1">
                  <StatusBadge
                    status={
                      (asset.assignee.status.charAt(0).toUpperCase() +
                        asset.assignee.status.slice(1).toLowerCase()) as
                        | "Active"
                        | "Inactive"
                        | "Pending"
                    }
                  />
                </div>
              </div>

              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Site
                </Text>
                <Text variant="p" className="text-gray-900">
                  {asset?.assignee?.site?.name || "Not assigned"}
                </Text>
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Basic Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Asset Name:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.name}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Asset Tag:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.tag}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Parent Site:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.parent_site.name || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Asset Type:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.type}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Equipment Class:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.equipment_class}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Manufacturer:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.manufacturer || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Upgraded/Modified:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.is_modified ? "Yes" : "No"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Model Number:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.model_number}
              </Text>
            </div>
          </div>

          {/* Operation Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Operation Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Criticality Level:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.criticality_level.charAt(0).toUpperCase() +
                  asset.criticality_level.slice(1).toLowerCase() || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Operating Hours:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.operating_hours || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Commissioned Date:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(asset.commissioned_date) || "N/A"}
              </Text>
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Maintenance Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Maintenance Strategy:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.maintenance_strategy || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Last Performed Maintenance:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(asset.last_performed_maintenance) || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Major Overhaul:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.major_overhaul || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Last Date Overhaul:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(asset.last_date_overhaul) || "N/A"}
              </Text>
            </div>
          </div>

          {/* Technical Specifications Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Technical Specifications Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Power Rating:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.power_rating || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Speed:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.speed || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Capacity:
              </Text>
              <Text variant="span" className="text-gray-900">
                {asset.capacity || "N/A"}
              </Text>
            </div>
          </div>

          {asset.datasheet?.file_url && (
            <div className="p-4 border border-gray-100">
              <Text variant="span" weight="medium">
                Datasheet
              </Text>
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Text variant="span" className="text-gray-600 font-medium">
                      {asset.datasheet.file_name || "Asset Datasheet"}
                    </Text>
                    {asset.datasheet.uploaded_at && (
                      <Text
                        variant="span"
                        className="text-xs text-gray-500 block"
                      >
                        Uploaded on {formatDate(asset.datasheet.uploaded_at)}
                      </Text>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="small"
                    disabled={isDatasheetLoading || !datasheetUrl}
                    onClick={() =>
                      datasheetUrl &&
                      window.open(datasheetUrl, "_blank", "noopener,noreferrer")
                    }
                  >
                    {isDatasheetLoading ? "Loading..." : "Open Datasheet"}
                  </Button>
                </div>
                {datasheetError && (
                  <Text variant="span" className="text-sm text-red-500">
                    {datasheetError}
                  </Text>
                )}
                {datasheetUrl && !datasheetError && (
                  <iframe
                    src={datasheetUrl}
                    title="Asset Datasheet"
                    className="h-96 w-full rounded border border-gray-200"
                  />
                )}
                {!datasheetUrl && !datasheetError && isDatasheetLoading && (
                  <Text variant="span" className="text-sm text-gray-500">
                    Loading preview...
                  </Text>
                )}
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline">Edit {asset.assignee.role}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
