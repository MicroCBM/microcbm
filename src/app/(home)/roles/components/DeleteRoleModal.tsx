"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Text, Button } from "@/components";
import { Role } from "@/types";

interface DeleteRoleModalProps {
  role: Role | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (roleId: string) => void;
  isDeleting: boolean;
}

export function DeleteRoleModal({
  role,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteRoleModalProps) {
  if (!role) return null;

  const handleConfirm = () => {
    onConfirm(role.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Text variant="span" className="text-gray-600">
            Are you sure you want to delete the role{" "}
            <span className="font-semibold text-gray-900">"{role.name}"</span>?
            This action cannot be undone.
          </Text>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <Text variant="span" className="text-red-800 text-sm">
              <strong>Warning:</strong> This will permanently delete the role
              and remove it from all assigned users.
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
