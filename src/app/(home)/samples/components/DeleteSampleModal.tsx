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
import { Sample } from "@/types";

interface DeleteSampleModalProps {
  sample: Sample | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sampleId: string) => void;
  isDeleting: boolean;
}

export const DeleteSampleModal = ({
  sample,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteSampleModalProps) => {
  if (!sample) return null;

  const handleConfirm = () => {
    onConfirm(sample.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Sample</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Text variant="p" className="text-gray-600">
            Are you sure you want to delete this sample? This action cannot be
            undone.
          </Text>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text variant="span" className="text-sm font-medium text-gray-700">
              Sample Details:
            </Text>
            <div className="mt-2 space-y-1">
              <Text variant="p" className="text-sm text-gray-600">
                <strong>Serial Number:</strong> {sample.serial_number}
              </Text>
              <Text variant="p" className="text-sm text-gray-600">
                <strong>Site:</strong>{" "}
                {sample.site?.name || sample.site?.id || "N/A"}
              </Text>
              <Text variant="p" className="text-sm text-gray-600">
                <strong>Severity:</strong>{" "}
                <span className="capitalize">{sample.severity}</span>
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
            Delete Sample
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
