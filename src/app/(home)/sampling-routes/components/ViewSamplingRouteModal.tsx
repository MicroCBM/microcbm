"use client";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import { Text, StatusBadge } from "@/components";
import { SamplingRoute } from "@/types";
import dayjs from "dayjs";

interface ViewSamplingRouteModalProps {
  samplingRoute: SamplingRoute | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewSamplingRouteModal({
  samplingRoute,
  isOpen,
  onClose,
}: ViewSamplingRouteModalProps) {
  if (!samplingRoute) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      return dayjs(dateString).format("MM/DD/YYYY, h:mm:ss A");
    } catch {
      return "N/A";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Sampling Route Details</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* Route Details */}
          <div className="p-4 border border-gray-100 rounded-lg">
            <Text variant="span" weight="medium" className="block mb-4">
              Route Details
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Route Name:
              </Text>
              <Text variant="span" className="text-gray-900">
                {samplingRoute.name}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Description:
              </Text>
              <Text variant="span" className="text-gray-900">
                {samplingRoute.description || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Status:
              </Text>
              <StatusBadge
                status={
                  (samplingRoute.status.charAt(0).toUpperCase() +
                    samplingRoute.status.slice(1).toLowerCase()) as
                    | "Active"
                    | "Inactive"
                    | "Pending"
                }
              />
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site:
              </Text>
              <Text variant="span" className="text-gray-900">
                {samplingRoute.site.name}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Tag:
              </Text>
              <Text variant="span" className="text-gray-900">
                {samplingRoute.site.tag}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Installation Environment:
              </Text>
              <Text variant="span" className="text-gray-900">
                {samplingRoute.site.installation_environment || "N/A"}
              </Text>
            </div>
          </div>

          {/* Technician Information */}
          {samplingRoute.technician ? (
            <div className="p-4 border border-gray-100 rounded-lg">
              <Text variant="span" weight="medium" className="block mb-4">
                Assigned Technician
              </Text>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <Text variant="span" className="text-gray-600 font-medium">
                  Name:
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.technician.first_name}{" "}
                  {samplingRoute.technician.last_name}
                </Text>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <Text variant="span" className="text-gray-600 font-medium">
                  Email:
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.technician.email || "N/A"}
                </Text>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <Text variant="span" className="text-gray-600 font-medium">
                  Phone:
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.technician.phone || "N/A"}
                </Text>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Text variant="span" className="text-gray-600 font-medium">
                  Role:
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.technician.role || "N/A"}
                </Text>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-gray-100 rounded-lg">
              <Text variant="span" weight="medium" className="block mb-4">
                Assigned Technician
              </Text>
              <Text variant="span" className="text-gray-500">
                No technician assigned
              </Text>
            </div>
          )}

          {/* Timestamps */}
          <div className="p-4 border border-gray-100 rounded-lg">
            <Text variant="span" weight="medium" className="block mb-4">
              Timestamps
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Created At:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(samplingRoute.created_at_datetime)}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Updated At:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(samplingRoute.updated_at_datetime)}
              </Text>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
