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
import { EditSamplePayload, EDIT_SAMPLE_SCHEMA } from "@/schema";
import { editSampleService } from "@/app/actions";
import { Sample, Sites, Asset, SamplingPoint } from "@/types";
import Input from "@/components/input/Input";
import dayjs from "dayjs";

const SEVERITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "urgent", label: "Urgent" },
];

const YES_NO_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

interface EditSampleFormProps {
  sample: Sample;
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}

export function EditSampleForm({
  sample,
  sites,
  assets,
  samplingPoints,
}: EditSampleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditSamplePayload>({
    resolver: zodResolver(EDIT_SAMPLE_SCHEMA),
  });

  useEffect(() => {
    if (sample) {
      // Convert Unix timestamp to datetime-local format
      const dateSampled = dayjs
        .unix(sample.date_sampled)
        .format("YYYY-MM-DDTHH:mm");

      reset({
        site: { id: sample.site?.id || "" },
        asset: { id: sample.asset?.id || "" },
        sampling_point: { id: sample.sampling_point?.id || "" },
        serial_number: sample.serial_number,
        date_sampled: dateSampled as unknown as number,
        lab_name: sample.lab_name,
        service_meter_reading: sample.service_meter_reading,
        hrs: sample.hrs,
        oil_in_service: sample.oil_in_service,
        filter_changed: sample.filter_changed,
        oil_drained: sample.oil_drained,
        severity: sample.severity,
      });
    }
  }, [sample, reset]);

  const selectedAsset = watch("asset.id");

  // Filter sampling points by selected asset
  const filteredSamplingPoints = samplingPoints.filter(
    (sp) => sp.parent_asset?.id === selectedAsset
  );

  const onSubmit = async (data: EditSamplePayload) => {
    setIsSubmitting(true);
    try {
      // Convert date to Unix timestamp
      const dateSampled = dayjs(data.date_sampled as unknown as string).unix();
      const payload = {
        ...data,
        date_sampled: dateSampled,
      };

      const response = await editSampleService(sample.id, payload);
      if (response.success) {
        toast.success("Sample updated successfully", {
          description: "The sample has been updated.",
        });
        router.push("/samples");
      } else {
        toast.error(
          response.message || "Failed to update sample. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update sample. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/samples");
  };

  if (!sample) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Text variant="h4" className="text-gray-900">
          Edit Sample
        </Text>
        <Text variant="p" className="text-gray-600">
          Update the details of the sample
        </Text>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site */}
          <Controller
            control={control}
            name="site.id"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger label="Site *" error={errors.site?.id?.message}>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Asset */}
          <Controller
            control={control}
            name="asset.id"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger
                  label="Asset *"
                  error={errors.asset?.id?.message}
                >
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Sampling Point */}
          <Controller
            control={control}
            name="sampling_point.id"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger
                  label="Sampling Point *"
                  error={errors.sampling_point?.id?.message}
                >
                  <SelectValue placeholder="Select a sampling point" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSamplingPoints.length > 0 ? (
                    filteredSamplingPoints.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id}>
                        {sp.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-sp" disabled>
                      Select an asset first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />

          {/* Serial Number */}
          <Input
            label="Serial Number *"
            placeholder="e.g., SN-2024-001"
            {...register("serial_number")}
            error={errors.serial_number?.message}
          />

          {/* Date Sampled */}
          <Input
            type="datetime-local"
            label="Date Sampled *"
            {...register("date_sampled")}
            error={errors.date_sampled?.message}
          />

          {/* Lab Name */}
          <Input
            label="Lab Name *"
            placeholder="e.g., LabCorp Oil Analysis"
            {...register("lab_name")}
            error={errors.lab_name?.message}
          />

          {/* Service Meter Reading */}
          <Input
            label="Service Meter Reading *"
            placeholder="e.g., 15000"
            {...register("service_meter_reading")}
            error={errors.service_meter_reading?.message}
          />

          {/* Hours */}
          <Input
            label="Hours *"
            placeholder="e.g., 1200"
            {...register("hrs")}
            error={errors.hrs?.message}
          />

          {/* Oil in Service */}
          <Input
            label="Oil in Service (hours)*"
            placeholder="e.g., 5000"
            {...register("oil_in_service")}
            error={errors.oil_in_service?.message}
          />

          {/* Filter Changed */}
          <Controller
            control={control}
            name="filter_changed"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger label="Filter Changed *">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Oil Drained */}
          <Controller
            control={control}
            name="oil_drained"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger label="Oil Drained *">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Severity */}
          <Controller
            control={control}
            name="severity"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger
                  label="Severity *"
                  error={errors.severity?.message}
                >
                  <SelectValue placeholder="Select severity" />
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

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Update Sample
          </Button>
        </div>
      </form>
    </div>
  );
}
