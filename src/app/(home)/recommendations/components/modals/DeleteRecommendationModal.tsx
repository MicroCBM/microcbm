"use client";

import React, { useState } from "react";
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
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";
import { deleteRecommendationService } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteRecommendationModalProps {
  onConfirm?: (recommendationId: string) => void;
}

export function DeleteRecommendationModal({
  onConfirm,
}: DeleteRecommendationModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const modal = usePersistedModalState<{ recommendation: Recommendation }>({
    paramName: MODALS.RECOMMENDATION.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.RECOMMENDATION.CHILDREN.DELETE);
  const recommendation = modal.modalData?.recommendation;

  if (!recommendation || !isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteRecommendationService(recommendation.id);
      if (response.success) {
        toast.success("Recommendation deleted successfully", {
          description: "The recommendation has been permanently removed.",
        });
        modal.closeModal();
        router.refresh();
        if (onConfirm) {
          onConfirm(recommendation.id);
        }
      } else {
        toast.error(
          response.message ||
            "Failed to delete recommendation. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to delete recommendation. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={modal.closeModal}>
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
          <Button
            variant="outline"
            onClick={modal.closeModal}
            disabled={isDeleting}
          >
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
