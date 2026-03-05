"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Text,
} from "@/components";
import type { RcaListRow } from "../lib/rca-list";

interface DeleteRcaModalProps {
  rca: RcaListRow | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rcaId: string) => void;
  isDeleting: boolean;
}

export function DeleteRcaModal({
  rca,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteRcaModalProps) {
  if (!rca) return null;

  const handleConfirm = () => {
    onConfirm(rca.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete RCA</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Text variant="p" className="text-gray-600">
            Are you sure you want to delete the RCA{" "}
            <span className="font-semibold text-gray-900">&quot;{rca.title}&quot;</span>? This
            action cannot be undone.
          </Text>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <Text variant="p" className="text-red-800 text-sm">
              <strong>Warning:</strong> This will permanently delete the RCA and all associated
              data. This action cannot be undone.
            </Text>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
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
            {isDeleting ? "Deleting..." : "Delete RCA"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
