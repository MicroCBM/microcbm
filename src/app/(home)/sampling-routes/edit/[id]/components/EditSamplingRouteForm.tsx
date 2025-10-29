"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { AddSamplingRoutePayload, ADD_SAMPLING_ROUTE_SCHEMA } from "@/schema";
import { editSamplingRouteService } from "@/app/actions";
import { Sites, SamplingRoute } from "@/types";
import Input from "@/components/input/Input";

interface USER_TYPE {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  organization: {
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    industry: string;
    logo_url: string;
    members: unknown;
    name: string;
    owner: unknown;
    sites: unknown;
    team_strength: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  password_hash: string;
  phone: string;
  role: string;
  role_id: string | null;
  role_obj: unknown;
  site: {
    address: string;
    attachments: null;
    city: string;
    country: string;
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    installation_environment: string;
    manager_email: string;
    manager_location: string;
    manager_name: string;
    manager_phone_number: string;
    members: unknown;
    name: string;
    organization: unknown;
    regulations_and_standards: unknown;
    tag: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  status: string;
  updated_at: number;
  updated_at_datetime: string;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function EditSamplingRouteForm({
  technicians,
  sites,
  samplingRoute,
}: {
  technicians: USER_TYPE[];
  sites: Sites[];
  samplingRoute: SamplingRoute;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddSamplingRoutePayload>({
    resolver: zodResolver(ADD_SAMPLING_ROUTE_SCHEMA),
    defaultValues: {
      name: samplingRoute.name,
      description: samplingRoute.description,
      site_id: samplingRoute.site.id,
      technician_id: samplingRoute.technician?.id || "",
      status: samplingRoute.status,
    },
  });

  useEffect(() => {
    // Reset form with sampling route data
    reset({
      name: samplingRoute.name,
      description: samplingRoute.description,
      site_id: samplingRoute.site.id,
      technician_id: samplingRoute.technician?.id || "",
      status: samplingRoute.status,
    });
  }, [samplingRoute, reset]);

  const selectedSite = watch("site_id");

  const onSubmit = async (data: AddSamplingRoutePayload) => {
    console.log("submit data", data);
    setIsSubmitting(true);
    try {
      const response = await editSamplingRouteService(samplingRoute.id, data);
      if (response.success) {
        toast.success("Sampling route updated successfully", {
          description: "The sampling route has been updated in your system.",
        });
        router.push("/sampling-routes");
      } else {
        console.log("response in edit sampling route", response.message);
        toast.error(
          response.message ||
            "Failed to update sampling route. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to update sampling route. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5 text-gray-600" />
            </button>
            <Text variant="h5">Edit Sampling Route</Text>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <Text variant="h6" className="text-gray-900">
              Basic Information
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Route Name *
                </label>
                <Input
                  {...register("name")}
                  placeholder="Enter route name"
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <Text variant="span" className="text-red-500 text-sm">
                    {errors.status.message}
                  </Text>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register("description")}
                placeholder="Enter route description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.description && (
                <Text variant="span" className="text-red-500 text-sm">
                  {errors.description.message}
                </Text>
              )}
            </div>
          </div>

          {/* Site and Technician Assignment Section */}
          <div className="space-y-6">
            <Text variant="h6" className="text-gray-900">
              Assignment
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Site *
                </label>
                <Select
                  value={watch("site_id")}
                  onValueChange={(value) => setValue("site_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} ({site.tag})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.site_id && (
                  <Text variant="span" className="text-red-500 text-sm">
                    {errors.site_id.message}
                  </Text>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Technician (Optional)
                </label>
                <Select
                  value={watch("technician_id") || ""}
                  onValueChange={(value) =>
                    setValue("technician_id", value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No technician assigned</SelectItem>
                    {technicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.id}>
                        {technician.first_name} {technician.last_name} (
                        {technician.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.technician_id && (
                  <Text variant="span" className="text-red-500 text-sm">
                    {errors.technician_id.message}
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-6">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Sampling Route"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
