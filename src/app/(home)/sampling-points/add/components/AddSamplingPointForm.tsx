"use client";
import React from "react";
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
  ErrorText,
  FileUploader,
} from "@/components";
import { Icon } from "@/libs";
import { AddSamplingPointPayload, ADD_SAMPLING_POINT_SCHEMA } from "@/schema";
import { addSamplingPointService, uploadImage } from "@/app/actions";
import { Asset } from "@/types";
import Input from "@/components/input/Input";
import { SamplingRoute } from "@/types";
import { useState } from "react";

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

export function AddSamplingPointForm({
  users,
  sampling_routes,
  assets,
}: {
  users: USER_TYPE[];
  sampling_routes: SamplingRoute[];
  assets: Asset[];
}) {
  console.log("assets", assets);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddSamplingPointPayload>({
    resolver: zodResolver(ADD_SAMPLING_POINT_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      status: "active",
      severity: "medium",
    },
  });

  const selectedAssetId = watch("parent_asset.id");
  const currentAssigneeId = watch("assignee.id");

  // Filter users based on selected asset's organization
  const filteredUsers = React.useMemo(() => {
    if (!selectedAssetId) {
      return users;
    }

    const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);
    if (!selectedAsset) {
      return users;
    }

    // Get organization ID from asset's assignee
    const assetOrganizationId = selectedAsset?.assignee?.organization?.id;

    if (!assetOrganizationId) {
      console.warn("Selected asset does not have an organization ID");
      return users;
    }

    // Filter users by matching organization ID
    const filtered = users.filter(
      (user) => user.organization?.id === assetOrganizationId
    );

    return filtered;
  }, [selectedAssetId, assets, users]);

  // Clear assignee if current assignee is not in filtered users or when asset changes
  React.useEffect(() => {
    if (selectedAssetId) {
      if (currentAssigneeId) {
        const isAssigneeValid = filteredUsers.some(
          (user) => user.id === currentAssigneeId
        );
        if (!isAssigneeValid) {
          setValue("assignee.id", "", { shouldValidate: false });
        }
      }
    } else {
      // If no asset is selected, clear assignee
      if (currentAssigneeId) {
        setValue("assignee.id", "", { shouldValidate: false });
      }
    }
  }, [selectedAssetId, filteredUsers, currentAssigneeId, setValue]);

  const uploadImageFile = async (
    file: File
  ): Promise<{
    url: string;
    name: string;
  } | null> => {
    setIsUploadingImage(true);
    try {
      const response = await uploadImage(
        { file },
        "sampling-point-attachments"
      );

      if (response.success) {
        // Extract file key from response - same as asset flow
        const fileKey = response.data?.data?.file_key;

        if (fileKey && typeof fileKey === "string") {
          return {
            url: fileKey,
            name: file.name,
          };
        }
        toast.error("Failed to get file key from upload response.");
        return null;
      } else {
        toast.error(
          response.message || "File upload failed. Please try again."
        );
        return null;
      }
    } catch {
      toast.error("File upload failed. Please try again.");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: AddSamplingPointPayload) => {
    // Ensure all required fields are present
    if (!data.component_type) {
      toast.error("Please select a component type");
      return;
    }

    setIsSubmitting(true);

    // Upload attachment if one is selected
    let attachmentData: { url: string; name: string } | null = null;

    if (attachmentFile) {
      attachmentData = await uploadImageFile(attachmentFile);
      if (!attachmentData) {
        // If file upload fails, stop form submission
        toast.error("File upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    // Prepare the payload with attachment
    const payload: AddSamplingPointPayload = {
      ...data,
      ...(attachmentData
        ? {
            attachments: [
              {
                url: attachmentData.url, // file_key from upload
                name: attachmentData.name,
              },
            ],
          }
        : data.attachments && data.attachments.length > 0
        ? { attachments: data.attachments }
        : {}),
    };

    try {
      const response = await addSamplingPointService(payload);
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
      <Button
        permissions="sampling-points:create"
        className="flex items-center gap-3 mb-2 cursor-pointer"
      >
        <Icon icon="mdi:arrow-left" className="w-5 h-5 text-gray-600" />
        <Text variant="h6">Add New Sampling Point</Text>
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="flex flex-col md:flex-row gap-6">
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

                <div>
                  <Controller
                    control={control}
                    name="parent_asset"
                    render={({ field }) => (
                      <Select
                        value={field.value?.id || ""}
                        onValueChange={(value) => field.onChange({ id: value })}
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
                    )}
                  />
                  {errors.parent_asset?.id && (
                    <ErrorText error={errors.parent_asset.id.message} />
                  )}
                </div>
              </div>
            </section>

            {/* Lubrication System Details */}
            <section className="flex flex-col gap-6 border border-gray-200 p-6">
              <Text variant="h6" className="mb-4">
                Lubrication System Details
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                  {errors.circuit_type && (
                    <ErrorText error={errors.circuit_type.message} />
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="component_type"
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value || "");
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
                  {errors.component_type && (
                    <ErrorText error={errors.component_type.message} />
                  )}
                </div>

                <div>
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
                  {errors.sample_frequency && (
                    <ErrorText error={errors.sample_frequency.message} />
                  )}
                </div>
                <div>
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
                  {errors.system_capacity && (
                    <ErrorText error={errors.system_capacity.message} />
                  )}
                </div>

                <Input
                  label="Current Oil Grade"
                  placeholder="Enter current oil grade"
                  className="col-span-full"
                  {...register("current_oil_grade")}
                  error={errors.current_oil_grade?.message}
                />

                <Input
                  label="Last Sample Date"
                  type="date"
                  placeholder="Enter last sample date"
                  {...register("last_sample_date")}
                  error={errors.last_sample_date?.message}
                />
                <Input
                  label="Effective Date"
                  type="date"
                  placeholder="Enter effective date"
                  {...register("effective_date")}
                  error={errors.effective_date?.message}
                />
              </div>
            </section>

            {/* Scheduling & Logistics */}
            <section className="flex flex-col gap-6 border border-gray-200 p-6">
              <Text variant="h6" className="mb-4">
                Scheduling & Logistics
              </Text>
              <div className="flex flex-col gap-4">
                <Input
                  type="date"
                  label="Next Due Date"
                  placeholder="Calculated from interval and last sample date"
                  {...register("next_due_date")}
                  error={errors.next_due_date?.message}
                />

                <div>
                  <Controller
                    name="assignee"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Select
                          value={field.value?.id || ""}
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange({ id: value });
                            } else {
                              field.onChange({ id: "" });
                            }
                          }}
                        >
                          <SelectTrigger
                            className="col-span-full"
                            label="Assignee"
                          >
                            <SelectValue placeholder="Select an assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredUsers.length > 0 &&
                              filteredUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.first_name} {user.last_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {selectedAssetId && filteredUsers.length === 0 && (
                          <p className="text-sm text-amber-600 mt-1">
                            No users found in the selected asset&apos;s
                            organization. Please select a different asset.
                          </p>
                        )}
                      </div>
                    )}
                  />
                  {errors.assignee?.id && (
                    <ErrorText error={errors.assignee.id.message} />
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="sampling_route"
                    render={({ field }) => (
                      <Select
                        value={field.value?.id || ""}
                        onValueChange={(value) => field.onChange({ id: value })}
                      >
                        <SelectTrigger label="Sampling Route">
                          <SelectValue placeholder="Select a sampling route" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampling_routes.map((route) => (
                            <SelectItem key={route.id} value={route.id}>
                              {route.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.sampling_route?.id && (
                    <ErrorText error={errors.sampling_route.id.message} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Sampling Port Type"
                    placeholder="Enter sampling port type"
                    {...register("sampling_port_type")}
                    error={errors.sampling_port_type?.message}
                  />
                  <Input
                    label="Sampling Port Location"
                    placeholder="Enter sampling port location"
                    {...register("sampling_port_location")}
                    error={errors.sampling_port_location?.message}
                  />
                </div>

                <Input
                  label="Lab Destination"
                  placeholder="Enter lab destination"
                  {...register("lab_destination")}
                  error={errors.lab_destination?.message}
                />

                <Input
                  label="Sampling volume (ml)"
                  placeholder="Enter sampling volume"
                  {...register("sampling_volume")}
                  error={errors.sampling_volume?.message}
                />

                <Input
                  label="Special Instructions/Safety Notes"
                  type="textarea"
                  placeholder="Enter special instructions/safety notes"
                  {...register("special_instructions")}
                  error={errors.special_instructions?.message}
                />
              </div>
            </section>

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p">Attachments (optional)</Text>
              <FileUploader
                label="Upload Attachment"
                value={attachmentFile}
                onChange={setAttachmentFile}
                id="attachment"
              />
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

              <div>
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
                {errors.severity && (
                  <ErrorText error={errors.severity.message} />
                )}
              </div>
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
          <Button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            loading={isSubmitting || isUploadingImage}
            className="px-8"
          >
            {isUploadingImage
              ? "Uploading File..."
              : isSubmitting
              ? "Creating..."
              : "Create Sampling Point"}
          </Button>
        </div>
      </form>
    </div>
  );
}
