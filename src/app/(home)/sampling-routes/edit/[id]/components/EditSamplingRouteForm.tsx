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
import { Sites, SamplingRoute, Organization } from "@/types";
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
  organizations,
}: {
  technicians: USER_TYPE[];
  sites: Sites[];
  samplingRoute: SamplingRoute;
  organizations: Organization[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the organization from the site
  const initialOrganizationId = React.useMemo(() => {
    const site = sites.find((s) => s.id === samplingRoute.site.id);
    return site?.organization?.id || null;
  }, [sites, samplingRoute.site.id]);

  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(initialOrganizationId);

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
    // Set organization from the site's organization
    const site = sites.find((s) => s.id === samplingRoute.site.id);
    if (site?.organization?.id) {
      setSelectedOrganizationId(site.organization.id);
    }
  }, [samplingRoute, reset, sites]);

  const currentTechnicianId = watch("technician_id");
  const previousOrganizationRef = React.useRef<string | null>(null);

  // Filter sites based on selected organization
  const filteredSites = React.useMemo(() => {
    if (!selectedOrganizationId) return sites;
    return sites.filter(
      (site) => site.organization?.id === selectedOrganizationId
    );
  }, [selectedOrganizationId, sites]);

  // Clear site when organization changes
  React.useEffect(() => {
    if (
      previousOrganizationRef.current !== selectedOrganizationId &&
      previousOrganizationRef.current !== null
    ) {
      setValue("site_id", "", { shouldDirty: false });
    }
    previousOrganizationRef.current = selectedOrganizationId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganizationId]);

  // Filter technicians based on selected organization
  const filteredTechnicians = React.useMemo(() => {
    if (!selectedOrganizationId) return [];

    return technicians.filter(
      (technician) => technician.organization?.id === selectedOrganizationId
    );
  }, [selectedOrganizationId, technicians]);

  // Clear technician if current technician is not in filtered list when organization changes
  React.useEffect(() => {
    if (selectedOrganizationId && currentTechnicianId) {
      const isTechnicianValid = filteredTechnicians.some(
        (technician) => technician.id === currentTechnicianId
      );
      if (!isTechnicianValid) {
        setValue("technician_id", "", { shouldValidate: false });
      }
    } else if (!selectedOrganizationId && currentTechnicianId) {
      setValue("technician_id", "", { shouldValidate: false });
    }
  }, [
    selectedOrganizationId,
    filteredTechnicians,
    currentTechnicianId,
    setValue,
  ]);

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
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 border border-gray-200 flex items-center justify-center"
        >
          <Icon icon="mdi:chevron-left" className=" size-5" />
        </button>

        <Text variant="h6">Edit Sampling Route</Text>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 flex flex-col gap-4"
      >
        {/* Basic Information Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-4 flex-1">
            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="h6" className="text-gray-900">
                Basic Information
              </Text>

              <div className="flex flex-col gap-4">
                <Input
                  {...register("name")}
                  placeholder="Enter route name"
                  error={errors.name?.message}
                  label="Route Name"
                />

                <Input
                  type="textarea"
                  rows={4}
                  {...register("description")}
                  placeholder="Enter route description"
                  error={errors.description?.message}
                  label="Description"
                />
              </div>
            </section>
            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="h6" className="text-gray-900">
                Assignment
              </Text>

              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Select
                    value={selectedOrganizationId || ""}
                    onValueChange={setSelectedOrganizationId}
                  >
                    <SelectTrigger label="Organization">
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((organization) => (
                        <SelectItem
                          key={organization.id}
                          value={organization.id}
                        >
                          {organization.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select
                    value={watch("site_id") || ""}
                    onValueChange={(value) => setValue("site_id", value)}
                    disabled={!selectedOrganizationId}
                  >
                    <SelectTrigger label="Site">
                      <SelectValue
                        placeholder={
                          !selectedOrganizationId
                            ? "Select an organization first"
                            : filteredSites.length === 0
                            ? "No sites available"
                            : "Select site"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSites.map((site) => (
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
                  <Select
                    value={watch("technician_id") || "none"}
                    onValueChange={(value) =>
                      setValue(
                        "technician_id",
                        value === "none" ? undefined : value
                      )
                    }
                    disabled={
                      !selectedOrganizationId ||
                      filteredTechnicians.length === 0
                    }
                  >
                    <SelectTrigger label="Technician">
                      <SelectValue
                        placeholder={
                          !selectedOrganizationId
                            ? "Select an organization first"
                            : filteredTechnicians.length === 0
                            ? "No technicians available for this organization"
                            : "Select technician"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        No technician assigned
                      </SelectItem>
                      {filteredTechnicians.length > 0 &&
                        filteredTechnicians.map((technician) => (
                          <SelectItem key={technician.id} value={technician.id}>
                            {technician.first_name} {technician.last_name} (
                            {technician.role})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {selectedOrganizationId &&
                    filteredTechnicians.length === 0 && (
                      <Text variant="span" className="text-amber-600 text-sm">
                        No technicians found for the selected organization.
                        Please select a different organization.
                      </Text>
                    )}
                  {errors.technician_id && (
                    <Text variant="span" className="text-red-500 text-sm">
                      {errors.technician_id.message}
                    </Text>
                  )}
                </div>
              </div>
            </section>
          </div>

          <section className="flex flex-col gap-6 border border-gray-100 p-6 w-full lg:max-w-[300px]">
            <Text variant="h6" className="text-gray-900">
              Status
            </Text>
            <Select
              value={watch("status") || ""}
              onValueChange={(value) => setValue("status", value)}
            >
              <SelectTrigger label="Status">
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
          </section>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 w-full sm:w-auto"
          >
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
    </>
  );
}
