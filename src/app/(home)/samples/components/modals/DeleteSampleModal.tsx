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
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";
import { deleteSampleService } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteSampleModal() {
  const router = useRouter();
  const modal = usePersistedModalState<{ sample: Sample }>({
    paramName: MODALS.SAMPLE.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.SAMPLE.CHILDREN.DELETE);
  const sample = modal.modalData?.sample;
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!sample || !isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteSampleService(sample.id);
      if (response.success) {
        toast.success("Sample deleted successfully", {
          description: "The sample has been permanently removed.",
        });
        router.refresh();
        modal.closeModal();
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

  return (
    <Dialog open={isOpen} onOpenChange={modal.closeModal}>
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
            onClick={modal.closeModal}
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
}
