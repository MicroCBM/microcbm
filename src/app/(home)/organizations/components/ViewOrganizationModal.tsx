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
import { Organization } from "@/types";
import dayjs from "dayjs";

interface ViewOrganizationModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewOrganizationModal = ({
  organization,
  isOpen,
  onClose,
}: ViewOrganizationModalProps) => {
  if (!organization) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Organization Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Header */}
          <div className="flex items-start gap-4">
            {/* {organization.logo_url && (
              <img
                src={organization.logo_url}
                alt={organization.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )} */}
            <div className="flex-1">
              <Text variant="h6" className="text-gray-900">
                {organization.name}
              </Text>
              <Text variant="p" className="text-gray-600 capitalize">
                {organization.industry}
              </Text>
              <Text variant="p" className="text-sm text-gray-500">
                Team Size: {organization.team_strength}
              </Text>
            </div>
          </div>

          {/* Organization Details */}
          <div className="flex flex-col gap-4">
            <div>
              <Text variant="span" className="text-gray-700">
                Description
              </Text>
              <Text variant="p" className="text-gray-900 mt-1">
                {organization.description || "N/A"}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Industry
                </Text>
                <Text variant="p" className="text-gray-900 capitalize">
                  {organization.industry}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Team Size
                </Text>
                <Text variant="p" className="text-gray-900">
                  {organization.team_strength}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Created
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(organization.created_at_datetime).format(
                    "MMM D, YYYY"
                  )}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Last Updated
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(organization.updated_at_datetime).format(
                    "MMM D, YYYY"
                  )}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
