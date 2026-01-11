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
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";
import { deleteAlarmService } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteAlarmModal() {
  const router = useRouter();
  const modal = usePersistedModalState<{ alarm: Alarm }>({
    paramName: MODALS.ALARM.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.ALARM.CHILDREN.DELETE);
  const alarm = modal.modalData?.alarm;
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!alarm || !isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteAlarmService(alarm.id);
      if (response.success) {
        toast.success("Alarm deleted successfully", {
          description: "The alarm has been permanently removed.",
        });
        router.refresh();
        modal.closeModal();
      } else {
        toast.error(
          response.message || "Failed to delete alarm. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to delete alarm. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={modal.closeModal}>
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
            Delete Alarm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
