"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Text,
  Button,
} from "@/components";
import { Alarm } from "@/types";
import dayjs from "dayjs";

interface ViewAlarmModalProps {
  alarm: Alarm | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewAlarmModal = ({
  alarm,
  isOpen,
  onClose,
}: ViewAlarmModalProps) => {
  if (!alarm) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Alarm Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alarm Header */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Text variant="h6" className="text-gray-900">
                {alarm.parameter}
              </Text>
              <Text variant="p" className="text-gray-600">
                Site: {alarm.site?.name || alarm.site?.id || "N/A"}
              </Text>
              <Text variant="p" className="text-sm text-gray-500">
                Status:{" "}
                {alarm.acknowledged_status ? "Acknowledged" : "Unacknowledged"}
              </Text>
            </div>
          </div>

          {/* Alarm Details */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Parameter
                </Text>
                <Text variant="p" className="text-gray-900">
                  {alarm.parameter}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Site
                </Text>
                <Text variant="p" className="text-gray-900">
                  {alarm.site?.name || alarm.site?.id || "N/A"}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  First Detected
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(alarm.first_detected).format("MMM D, YYYY HH:mm")}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Status
                </Text>
                <Text variant="p" className="text-gray-900">
                  {alarm.acknowledged_status
                    ? "Acknowledged"
                    : "Unacknowledged"}
                </Text>
              </div>
            </div>

            <div>
              <Text variant="span" className="text-gray-700">
                Linked Recommendations
              </Text>
              <div className="mt-1">
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
                  <Text variant="p" className="text-gray-500">
                    No linked recommendations
                  </Text>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Created
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(alarm.created_at_datetime).format("MMM D, YYYY")}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Last Updated
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(alarm.updated_at_datetime).format("MMM D, YYYY")}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
