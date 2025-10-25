"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Text,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Icon } from "@/libs";
import { AddSamplingPointPayload, ADD_SAMPLING_POINT_SCHEMA } from "@/schema";
import { addSamplingPointService, getAssetsService } from "@/app/actions";
import { Asset } from "@/types";
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

export function AddSamplingPointForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddSamplingPointPayload>({
    resolver: zodResolver(ADD_SAMPLING_POINT_SCHEMA),
    defaultValues: {
      status: "active",
      severity: "medium",
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
    console.log("submit data", data);
    setIsSubmitting(true);
    try {
      const response = await addSamplingPointService(data);
      if (response.success) {
        toast.success("Sampling point created successfully", {
          description: "The sampling point has been added to your system.",
        });
        router.push("/sampling-points");
      } else {
        console.log("response in add sampling point", response.message);
        toast.error(
          response.message ||
            "Failed to create sampling point. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to create sampling point. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/sampling-points");
  };

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5 text-gray-600" />
          </button>
          <Text variant="h6">Add New Sampling Point</Text>
        </div>
        <div></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="flex gap-6">
          <div className="flex flex-col gap-6 flex-1">
            {/* Basic Information */}
            <section className="flex flex-col gap-6 border border-gray-200 p-6">
              <Text variant="p">Basic Information</Text>
              <div className="flex flex-col gap-4">
                <Input
                  label="Sampling Point Name"
                  placeholder="e.g., Main Gearbox Oil Sampling Point"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="Tag"
                  placeholder="e.g., GBX-001-OIL"
                  {...register("tag")}
                  error={errors.tag?.message}
                />

                <Controller
                  control={control}
                  name="parent_asset.id"
                  render={({ field }) => (
                    <div>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger label="Parent Asset">
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name} ({asset.tag})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </section>

            {/* Technical Specifications */}
            <section className="flex flex-col gap-6 border border-gray-200 p-6">
              <Text variant="h6" className="mb-4">
                Technical Specifications
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="circuit_type"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger label="Circuit Type">
                        <SelectValue placeholder="Select a circuit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CIRCUIT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="component_type"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger label="Component Type">
                        <SelectValue placeholder="Select a component type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPONENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="sample_frequency"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger label="Sample Frequency">
                        <SelectValue placeholder="Select a sample frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {SAMPLE_FREQUENCIES.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="system_capacity"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger label="System Capacity">
                        <SelectValue placeholder="Select a system capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        {SYSTEM_CAPACITIES.map((capacity) => (
                          <SelectItem key={capacity} value={capacity}>
                            {capacity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Input
                  label="Current Oil Grade"
                  placeholder="Enter current oil grade"
                  className="col-span-full"
                  {...register("current_oil_grade")}
                  error={errors.current_oil_grade?.message}
                />
              </div>
            </section>
          </div>
          <div className="flex flex-col gap-6 border border-gray-200 p-6 max-w-[300px] w-full">
            <Text variant="p">Sampling Point Details</Text>
            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger label="Status">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger label="Severity">
                      <SelectValue placeholder="Select a severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
                Creating...
              </>
            ) : (
              "Create Sampling Point"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
