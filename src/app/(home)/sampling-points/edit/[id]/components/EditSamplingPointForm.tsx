"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Text, Select, Label } from "@/components";
import { Icon } from "@/libs";
import { AddSamplingPointPayload, ADD_SAMPLING_POINT_SCHEMA } from "@/schema";
import { editSamplingPointService, getAssetsService } from "@/app/actions";
import { SamplingPoint, Asset } from "@/types";
import Input from "@/components/input/Input";

const CIRCUIT_TYPES = [
  "Circulating Oil (Recirculation System)",
  "Static Oil (Sump System)",
  "Hydraulic System",
  "Gear System",
  "Compressor System",
  "Turbine System",
  "Engine System",
  "Other",
];

const COMPONENT_TYPES = [
  "Gearbox",
  "Engine",
  "Hydraulic Pump",
  "Compressor",
  "Turbine",
  "Motor",
  "Bearing",
  "Transmission",
  "Other",
];

const SAMPLE_FREQUENCIES = [
  "Daily (≈8-24 Hours)",
  "Weekly (≈40-168 Hours)",
  "Monthly (≈250-500 Hours)",
  "Quarterly (≈750-1500 Hours)",
  "Semi-annually (≈1500-3000 Hours)",
  "Annually (≈3000-6000 Hours)",
  "As needed",
];

const SYSTEM_CAPACITIES = [
  "Small (< 5 L / < 1.3 Gal)",
  "Medium (5 L - 50 L / 1.3 - 13 Gal)",
  "Large (50 L - 500 L / 13 - 132 Gal)",
  "Very Large (> 500 L / > 132 Gal)",
];

const OIL_GRADES = [
  "Mineral Oil (R&O)",
  "Synthetic Oil (PAO)",
  "Synthetic Oil (PAG)",
  "Synthetic Oil (Esters)",
  "Biodegradable Oil",
  "Fire-resistant Oil",
  "Other",
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Under Maintenance" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

interface EditSamplingPointFormProps {
  samplingPoint: SamplingPoint;
}

export function EditSamplingPointForm({
  samplingPoint,
}: EditSamplingPointFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddSamplingPointPayload>({
    resolver: zodResolver(ADD_SAMPLING_POINT_SCHEMA),
    defaultValues: {
      name: samplingPoint.name,
      tag: samplingPoint.tag,
      parent_asset: { id: samplingPoint.parent_asset.id },
      circuit_type: samplingPoint.circuit_type,
      component_type: samplingPoint.component_type,
      sample_frequency: samplingPoint.sample_frequency,
      system_capacity: samplingPoint.system_capacity,
      current_oil_grade: samplingPoint.current_oil_grade,
      status: samplingPoint.status,
      severity: samplingPoint.severity,
    },
  });

  const selectedParentAsset = watch("parent_asset");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getAssetsService();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("Failed to fetch assets");
      }
    };

    fetchAssets();
  }, []);

  const onSubmit = async (data: AddSamplingPointPayload) => {
    setIsSubmitting(true);
    try {
      const response = await editSamplingPointService(samplingPoint.id, data);
      if (response.success) {
        toast.success("Sampling point updated successfully", {
          description: "The sampling point has been updated in your system.",
        });
        router.push("/sampling-points");
      } else {
        toast.error(
          response.message ||
            "Failed to update sampling point. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to update sampling point. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/sampling-points");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5 text-gray-600" />
          </button>
          <Text variant="h4">Edit Sampling Point</Text>
        </div>
        <Text variant="span" className="text-gray-600">
          Update the sampling point information and specifications.
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <Text variant="h6" className="mb-4">
            Basic Information
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Sampling Point Name *</Label>
              <Input
                label="Sampling Point Name"
                placeholder="e.g., Main Gearbox Oil Sampling Point"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag *</Label>
              <Input
                label="Tag"
                placeholder="e.g., GBX-001-OIL"
                {...register("tag")}
                error={errors.tag?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_asset">Parent Asset *</Label>
              <Select
                value={selectedParentAsset?.id || ""}
                onValueChange={(value) => {
                  setValue("parent_asset.id", value);
                }}
              >
                <option value="">Select an asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.tag})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="component_type">Component Type *</Label>
              <Select
                value={watch("component_type") || ""}
                onValueChange={(value) => {
                  setValue("component_type", value);
                }}
              >
                <option value="">Select component type</option>
                {COMPONENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <Text variant="h6" className="mb-4">
            Technical Specifications
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="circuit_type">Circuit Type *</Label>
              <Select
                value={watch("circuit_type") || ""}
                onValueChange={(value) => {
                  setValue("circuit_type", value);
                }}
              >
                <option value="">Select circuit type</option>
                {CIRCUIT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sample_frequency">Sample Frequency *</Label>
              <Select
                value={watch("sample_frequency") || ""}
                onValueChange={(value) => {
                  setValue("sample_frequency", value);
                }}
              >
                <option value="">Select sample frequency</option>
                {SAMPLE_FREQUENCIES.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system_capacity">System Capacity *</Label>
              <Select
                value={watch("system_capacity") || ""}
                onValueChange={(value) => {
                  setValue("system_capacity", value);
                }}
              >
                <option value="">Select system capacity</option>
                {SYSTEM_CAPACITIES.map((capacity) => (
                  <option key={capacity} value={capacity}>
                    {capacity}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_oil_grade">Current Oil Grade *</Label>
              <Select
                value={watch("current_oil_grade") || ""}
                onValueChange={(value) => {
                  setValue("current_oil_grade", value);
                }}
              >
                <option value="">Select oil grade</option>
                {OIL_GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Status and Severity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <Text variant="h6" className="mb-4">
            Status and Severity
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watch("status") || ""}
                onValueChange={(value) => {
                  setValue("status", value);
                }}
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select
                value={watch("severity") || ""}
                onValueChange={(value) => {
                  setValue("severity", value);
                }}
              >
                <option value="">Select severity</option>
                {SEVERITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-8">
            {isSubmitting ? (
              <>
                <Icon
                  icon="mdi:loading"
                  className="w-4 h-4 mr-2 animate-spin"
                />
                Updating...
              </>
            ) : (
              <>
                <Icon icon="mdi:check-circle" className="w-4 h-4 mr-2" />
                Update Sampling Point
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
