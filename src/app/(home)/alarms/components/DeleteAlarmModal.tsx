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

interface DeleteAlarmModalProps {
  alarm: Alarm | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alarmId: string) => void;
  isDeleting: boolean;
}

export const DeleteAlarmModal = ({
  alarm,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteAlarmModalProps) => {
  if (!alarm) return null;

  const handleConfirm = () => {
    onConfirm(alarm.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Alarm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Text variant="p" className="text-gray-600">
            Are you sure you want to delete this alarm? This action cannot be
            undone.
          </Text>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text variant="span" className="text-sm font-medium text-gray-700">
              Alarm Details:
            </Text>
            <div className="mt-2 space-y-1">
              <Text variant="p" className="text-sm text-gray-600">
                <strong>Parameter:</strong> {alarm.parameter}
              </Text>
              <Text variant="p" className="text-sm text-gray-600">
                <strong>Site:</strong>{" "}
                {alarm.site?.name || alarm.site?.id || "N/A"}
              </Text>
              <Text variant="p" className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                {alarm.acknowledged_status ? "Acknowledged" : "Unacknowledged"}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={isDeleting}
          >
            Delete Alarm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
