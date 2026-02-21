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
import { Sites } from "@/types";

interface DeleteSiteModalProps {
  site: Sites | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (siteId: string) => void;
  isDeleting?: boolean;
}

export function DeleteSiteModal({
  site,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteSiteModalProps) {
  if (!site) return null;

  const handleConfirm = () => {
    onConfirm(site.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Site</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Text variant="p" className="text-gray-600">
            Are you sure you want to delete the site{" "}
            <span className="font-semibold text-gray-900">
              &ldquo;{site.name}&rdquo;
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
            Delete Site
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
