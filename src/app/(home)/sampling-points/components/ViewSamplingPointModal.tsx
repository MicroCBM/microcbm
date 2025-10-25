"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Text, StatusBadge } from "@/components";
import { SamplingPoint } from "@/types";

interface ViewSamplingPointModalProps {
  samplingPoint: SamplingPoint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewSamplingPointModal({
  samplingPoint,
  isOpen,
  onClose,
}: ViewSamplingPointModalProps) {
  if (!samplingPoint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sampling Point Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Text variant="label" className="text-gray-600">
                  Sampling Point Name
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.name}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Tag
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.tag}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Component Type
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.component_type}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Circuit Type
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.circuit_type}
                </Text>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Text variant="label" className="text-gray-600">
                  Sample Frequency
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.sample_frequency}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  System Capacity
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.system_capacity}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Current Oil Grade
                </Text>
                <Text variant="span" className="text-gray-900">
                  {samplingPoint.current_oil_grade}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Status
                </Text>
                <StatusBadge
                  status={
                    (samplingPoint.status.charAt(0).toUpperCase() +
                      samplingPoint.status.slice(1).toLowerCase()) as
                      | "Active"
                      | "Inactive"
                      | "Pending"
                  }
                />
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Severity
                </Text>
                <StatusBadge
                  status={
                    (samplingPoint.severity.charAt(0).toUpperCase() +
                      samplingPoint.severity.slice(1).toLowerCase()) as
                      | "Low"
                      | "Medium"
                      | "High"
                  }
                />
              </div>
            </div>
          </div>

          {/* Parent Asset Information */}
          <div className="border-t pt-6">
            <Text variant="h6" className="mb-4">
              Parent Asset Information
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Text variant="label" className="text-gray-600">
                    Asset Name
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.name}
                  </Text>
                </div>

                <div>
                  <Text variant="label" className="text-gray-600">
                    Asset Tag
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.tag}
                  </Text>
                </div>

                <div>
                  <Text variant="label" className="text-gray-600">
                    Asset Type
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.type}
                  </Text>
                </div>

                <div>
                  <Text variant="label" className="text-gray-600">
                    Equipment Class
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.equipment_class}
                  </Text>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Text variant="label" className="text-gray-600">
                    Manufacturer
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.manufacturer}
                  </Text>
                </div>

                <div>
                  <Text variant="label" className="text-gray-600">
                    Model Number
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.model_number}
                  </Text>
                </div>

                <div>
                  <Text variant="label" className="text-gray-600">
                    Serial Number
                  </Text>
                  <Text variant="span" className="text-gray-900">
                    {samplingPoint.parent_asset.serial_number}
                  </Text>
                </div>

                <div>
                  <Text variant="label" className="text-gray-600">
                    Criticality Level
                  </Text>
                  <StatusBadge
                    status={
                      (samplingPoint.parent_asset.criticality_level
                        .charAt(0)
                        .toUpperCase() +
                        samplingPoint.parent_asset.criticality_level
                          .slice(1)
                          .toLowerCase()) as "Low" | "Medium" | "High"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t pt-6">
            <Text variant="h6" className="mb-4">
              Timestamps
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text variant="label" className="text-gray-600">
                  Created At
                </Text>
                <Text variant="span" className="text-gray-900">
                  {new Date(samplingPoint.created_at_datetime).toLocaleString()}
                </Text>
              </div>

              <div>
                <Text variant="label" className="text-gray-600">
                  Updated At
                </Text>
                <Text variant="span" className="text-gray-900">
                  {new Date(samplingPoint.updated_at_datetime).toLocaleString()}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
