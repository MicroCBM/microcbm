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
import dayjs from "dayjs";

interface ViewSampleModalProps {
  sample: Sample | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewSampleModal = ({
  sample,
  isOpen,
  onClose,
}: ViewSampleModalProps) => {
  if (!sample) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sample Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sample Header */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Text variant="h6" className="text-gray-900">
                {sample.serial_number}
              </Text>
              <Text variant="p" className="text-gray-600">
                Lab: {sample.lab_name}
              </Text>
              <Text variant="p" className="text-sm text-gray-500">
                Severity: <span className="capitalize">{sample.severity}</span>
              </Text>
            </div>
          </div>

          {/* Sample Details */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Serial Number
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.serial_number}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Date Sampled
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs.unix(sample.date_sampled).format("MMM D, YYYY HH:mm")}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Site
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.site?.name || sample.site?.id || "N/A"}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Asset
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.asset?.name || sample.asset?.id || "N/A"}
                </Text>
              </div>
            </div>

            <div>
              <Text variant="span" className="text-gray-700">
                Sampling Point
              </Text>
              <Text variant="p" className="text-gray-900">
                {sample.sampling_point?.name ||
                  sample.sampling_point?.id ||
                  "N/A"}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Lab Name
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.lab_name}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Severity
                </Text>
                <Text variant="p" className="capitalize text-gray-900">
                  {sample.severity}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Service Meter Reading
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.service_meter_reading}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Hours
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.hrs}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Oil in Service (hours)
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.oil_in_service}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Filter Changed
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.filter_changed}
                </Text>
              </div>
            </div>

            <div>
              <Text variant="span" className="text-gray-700">
                Oil Drained
              </Text>
              <Text variant="p" className="text-gray-900">
                {sample.oil_drained}
              </Text>
            </div>

            {/* Wear Metals */}
            {sample.wear_metals && sample.wear_metals.length > 0 && (
              <div>
                <Text variant="span" className="text-gray-700 font-semibold">
                  Wear Metals
                </Text>
                <div className="mt-2 space-y-2">
                  {sample.wear_metals.map((metal, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 p-2 bg-gray-50 rounded"
                    >
                      <Text variant="span" className="capitalize">
                        {metal.element}
                      </Text>
                      <Text variant="span">
                        {metal.value} {metal.unit}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contaminants */}
            {sample.contaminants && sample.contaminants.length > 0 && (
              <div>
                <Text variant="span" className="text-gray-700 font-semibold">
                  Contaminants
                </Text>
                <div className="mt-2 space-y-2">
                  {sample.contaminants.map((contaminant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 p-2 bg-gray-50 rounded"
                    >
                      <Text variant="span" className="capitalize">
                        {contaminant.type}
                      </Text>
                      <Text variant="span">
                        {contaminant.value} {contaminant.unit}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Text variant="span" className="text-gray-700">
                  Created
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(sample.created_at_datetime).format("MMM D, YYYY")}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Last Updated
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(sample.updated_at_datetime).format("MMM D, YYYY")}
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
