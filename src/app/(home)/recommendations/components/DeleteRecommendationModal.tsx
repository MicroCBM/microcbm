"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Text,
} from "@/components";
import { Icon } from "@/libs";
import { Recommendation } from "@/types";

interface DeleteRecommendationModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recommendationId: string) => void;
  isDeleting: boolean;
}

export function DeleteRecommendationModal({
  recommendation,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteRecommendationModalProps) {
  if (!recommendation) return null;

  const handleConfirm = () => {
    onConfirm(recommendation.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Recommendation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <Icon icon="mdi:alert-circle" className="w-6 h-6 text-red-600" />
            <Text variant="span" className="text-red-800">
              This action cannot be undone.
            </Text>
          </div>

          <Text variant="p" className="text-gray-700">
            Are you sure you want to delete the recommendation{" "}
            <span className="font-medium">
              &quot;{recommendation.title}&quot;
            </span>
            ?
          </Text>

          <Text variant="span" className="text-sm text-gray-500">
            This will permanently remove the recommendation and all its
            associated data.
          </Text>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Recommendation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
