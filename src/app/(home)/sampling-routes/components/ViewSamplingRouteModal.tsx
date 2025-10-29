"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Text, StatusBadge } from "@/components";
import { SamplingRoute } from "@/types";

interface ViewSamplingRouteModalProps {
  samplingRoute: SamplingRoute | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewSamplingRouteModal({
  samplingRoute,
  isOpen,
  onClose,
}: ViewSamplingRouteModalProps) {
  if (!samplingRoute) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sampling Route Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Text variant="h6" className="text-gray-600">
                  Route Name
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.name}
                </Text>
              </div>

              <div>
                <Text variant="h6" className="text-gray-600">
                  Description
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.description}
                </Text>
              </div>

              <div>
                <Text variant="h6" className="text-gray-600">
                  Status
                </Text>
                <StatusBadge
                  status={
                    (samplingRoute.status.charAt(0).toUpperCase() +
                      samplingRoute.status.slice(1).toLowerCase()) as
                      | "Active"
                      | "Inactive"
                      | "Pending"
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Text variant="h6" className="text-gray-600">
                  Site
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.site.name}
                </Text>
              </div>

              <div>
                <Text variant="h6" className="text-gray-600">
                  Site Tag
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.site.tag}
                </Text>
              </div>

              <div>
                <Text variant="h6" className="text-gray-600">
                  Installation Environment
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingRoute.site.installation_environment}
                </Text>
              </div>
            </div>
          </div>

          {/* Technician Information */}
          {samplingRoute.technician && (
            <div className="border-t pt-6">
              <Text variant="h6" className="mb-4">
                Assigned Technician
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Text variant="h6" className="text-gray-600">
                      Name
                    </Text>
                    <Text variant="span" className="text-gray-900">
                      {samplingRoute.technician.first_name}{" "}
                      {samplingRoute.technician.last_name}
                    </Text>
                  </div>

                  <div>
                    <Text variant="h6" className="text-gray-600">
                      Email
                    </Text>
                    <Text variant="span" className="text-gray-900">
                      {samplingRoute.technician.email}
                    </Text>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Text variant="h6" className="text-gray-600">
                      Phone
                    </Text>
                    <Text variant="span" className="text-gray-900">
                      {samplingRoute.technician.phone}
                    </Text>
                  </div>

                  <div>
                    <Text variant="h6" className="text-gray-600">
                      Role
                    </Text>
                    <Text variant="span" className="text-gray-900">
                      {samplingRoute.technician.role}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-6">
            <Text variant="h6" className="mb-4">
              Timestamps
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text variant="h6" className="text-gray-600">
                  Created At
                </Text>
                <Text variant="span" className="text-gray-900">
                  {new Date(samplingRoute.created_at_datetime).toLocaleString()}
                </Text>
              </div>

              <div>
                <Text variant="h6" className="text-gray-600">
                  Updated At
                </Text>
                <Text variant="span" className="text-gray-900">
                  {new Date(samplingRoute.updated_at_datetime).toLocaleString()}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
