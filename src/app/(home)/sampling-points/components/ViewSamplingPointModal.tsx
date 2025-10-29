"use client";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import { StatusBadge } from "@/components";
import { SamplingPoint } from "@/types";
import dayjs from "dayjs";

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

  console.log("samplingPoint", samplingPoint);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Sampling Point Details</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* Basic Information */}
          <section className="flex flex-col gap-4 border border-gray-100 p-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Sampling Point Name</p>
              <p className="text-[#1f1f1f] text-xs">{samplingPoint.name}</p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Tag</p>
              <p className="text-[#1f1f1f] text-xs">{samplingPoint.tag}</p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Parent Asset</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.name}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Circuit Type</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.circuit_type}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Component Type</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.component_type}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Sample Frequency</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.sample_frequency}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">System Capacity</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.system_capacity}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Current Oil Grade</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.current_oil_grade}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Last Sample Date</p>
              <p className="text-[#1f1f1f] text-xs">
                {dayjs(samplingPoint.last_sample_date).format("MMM D, YYYY")}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Effective Date</p>
              <p className="text-[#1f1f1f] text-xs">
                {dayjs(samplingPoint.effective_date).format("MMM D, YYYY")}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Next Due Date</p>
              <p className="text-[#1f1f1f] text-xs">
                {dayjs(samplingPoint.next_due_date).format("MMM D, YYYY")}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Sampling Port Type</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.sampling_port_type}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Sampling Port Location</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.sampling_port_location || "N/A"}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Lab Destination</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.lab_destination}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Sampling Volume</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.sampling_volume}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">
                Special Instructions/Safety Notes
              </p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.special_instructions}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Status</p>

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

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Severity</p>
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

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Asset Name</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.name}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Asset Tag</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.tag}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Asset Type</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.type}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Equipment Class</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.equipment_class}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Manufacturer</p>

              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.manufacturer}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Model Number</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.model_number}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <p className="text-[#807f94] text-xs">Serial Number</p>
              <p className="text-[#1f1f1f] text-xs">
                {samplingPoint.parent_asset.serial_number}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-[#807f94] text-xs">Criticality Level</p>
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
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
