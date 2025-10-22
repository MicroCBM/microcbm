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
import { Asset } from "@/types";

interface DeleteAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assetId: string) => void;
  isDeleting?: boolean;
}

export const DeleteAssetModal = ({
  asset,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteAssetModalProps) => {
  if (!asset) return null;

  const handleConfirm = () => {
    onConfirm(asset.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Asset</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Text variant="p" className="text-gray-600">
            Are you sure you want to delete the asset{" "}
            <span className="font-semibold text-gray-900">
              &ldquo;{asset.name}&rdquo;
            </span>
            ? This action cannot be undone.
          </Text>
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
            Delete Asset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
