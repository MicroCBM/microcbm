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
import { Organization } from "@/types";

interface DeleteOrganizationModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (organizationId: string) => void;
  isDeleting?: boolean;
}

export const DeleteOrganizationModal = ({
  organization,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteOrganizationModalProps) => {
  if (!organization) return null;

  const handleConfirm = () => {
    onConfirm(organization.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Organization</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Text variant="p" className="text-gray-600">
            Are you sure you want to delete the organization{" "}
            <span className="font-semibold text-gray-900">
              &ldquo;{organization.name}&rdquo;
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
            Delete Organization
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
