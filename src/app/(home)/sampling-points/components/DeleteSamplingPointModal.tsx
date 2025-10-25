"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Text, Button } from "@/components";
import { SamplingPoint } from "@/types";

interface DeleteSamplingPointModalProps {
  samplingPoint: SamplingPoint | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (samplingPointId: string) => void;
  isDeleting: boolean;
}

export function DeleteSamplingPointModal({
  samplingPoint,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteSamplingPointModalProps) {
  if (!samplingPoint) return null;

  const handleConfirm = () => {
    onConfirm(samplingPoint.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Sampling Point</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Text variant="span" className="text-gray-600">
            Are you sure you want to delete the sampling point{" "}
            <span className="font-semibold text-gray-900">
              "{samplingPoint.name}"
            </span>
            ? This action cannot be undone.
          </Text>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <Text variant="span" className="text-red-800 text-sm">
              <strong>Warning:</strong> This will permanently delete the
              sampling point and all associated data.
            </Text>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-6"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
