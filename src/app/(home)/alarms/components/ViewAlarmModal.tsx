"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  StatusBadge,
  Text,
  Button,
} from "@/components";
import { Alarm, Sites } from "@/types";
import dayjs from "dayjs";

interface ViewAlarmModalProps {
  alarm: Alarm | null;
  isOpen: boolean;
  onClose: () => void;
  sites?: Sites[];
}

export const ViewAlarmModal = ({
  alarm,
  isOpen,
  onClose,
  sites = [],
}: ViewAlarmModalProps) => {
  if (!alarm) return null;

  // Find the site by matching the alarm's site id
  const site = sites.find((s) => s.id === alarm.site?.id);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD-MM-YYYY");
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD-MM-YYYY HH:mm");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[580px]">
        <SheetHeader>
          <SheetTitle>Alarm Details</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 h-screen overflow-y-auto">
          {/* Alarm Status */}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <Text
                variant="span"
                weight="medium"
                className="text-gray-700 text-sm"
              >
                Alarm Status
              </Text>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Acknowledgment Status
                </Text>
                <div className="mt-1">
                  <StatusBadge
                    status={
                      alarm.acknowledged_status
                        ? ("Active" as "Active" | "Inactive" | "Pending")
                        : ("Pending" as "Active" | "Inactive" | "Pending")
                    }
                  />
                </div>
              </div>

              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Parameter
                </Text>
                <Text variant="p" className="text-gray-900 font-medium">
                  {alarm.parameter}
                </Text>
              </div>

              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Site
                </Text>
                <Text variant="p" className="text-gray-900">
                  {site?.name || "N/A"}
                </Text>
              </div>
            </div>
          </section>

          {/* Alarm Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Alarm Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Parameter:
              </Text>
              <Text variant="span" className="text-gray-900">
                {alarm.parameter}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site?.name || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                First Detected:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDateTime(alarm.first_detected)}
              </Text>
            </div>
          </div>

          {/* Status Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Status Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Acknowledgment Status:
              </Text>
              <Text variant="span" className="text-gray-900">
                {alarm.acknowledged_status ? "Acknowledged" : "Unacknowledged"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Status:
              </Text>
              <StatusBadge
                status={
                  alarm.acknowledged_status
                    ? ("Active" as "Active" | "Inactive" | "Pending")
                    : ("Pending" as "Active" | "Inactive" | "Pending")
                }
              />
            </div>
          </div>

          {/* Linked Recommendations */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Linked Recommendations
            </Text>
            <div className="flex justify-between items-center pt-2">
              <div className="flex-1">
                {alarm.linked_recommendations &&
                alarm.linked_recommendations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {alarm.linked_recommendations.map((rec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {rec.title || rec.id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Text variant="span" className="text-gray-500">
                    No linked recommendations
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Timestamps
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Created:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(alarm.created_at_datetime)}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Last Updated:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(alarm.updated_at_datetime)}
              </Text>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
