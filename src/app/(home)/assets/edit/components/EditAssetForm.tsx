"use client";
import {
  SelectValue,
  Button,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  Text,
  Label,
  RadioGroupItem,
  RadioGroup,
  CreatableCombobox,
  FileUploader,
} from "@/components";
import { ADD_ASSET_SCHEMA, AddAssetPayload } from "@/schema";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Input from "@/components/input/Input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/libs";
import { Asset, Sites } from "@/types";
import { editAssetService, uploadImage, deleteFile } from "@/app/actions";
import dayjs from "dayjs";
import { ASSET_TYPE_OPTIONS } from "@/utils";
import { useState } from "react";
import { usePresignedUrl } from "@/hooks";

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

type FormData = z.infer<typeof ADD_ASSET_SCHEMA>;

export const EditAssetForm = ({
  sites,
  users,
  assetId,
  asset,
}: {
  sites: Sites[];
  users: USER_TYPE[];
  assetId?: string;
  asset?: Asset;
}) => {
  const router = useRouter();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [datasheetFile, setDatasheetFile] = useState<File | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [isFileDeleted, setIsFileDeleted] = useState(false);

  // Get presigned URL for existing datasheet
  const existingDatasheetKey = asset?.datasheet?.file_url;
  const { url: datasheetUrl, isLoading: isDatasheetLoading } = usePresignedUrl(
    existingDatasheetKey && !isFileDeleted ? existingDatasheetKey : null,
    !!existingDatasheetKey && !isFileDeleted
  );

  // Helper function to extract numeric value from string with units
  const extractNumericValue = (value?: string): string => {
    if (!value) return "";
    // Extract number from strings like "10 kW", "10 RPM", "10 m³/h"
    const match = value.match(/^(\d+(?:\.\d+)?)/);
    return match ? match[1] : value;
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_ASSET_SCHEMA),
    mode: "onSubmit",
  });

  const selectedSiteId = watch("parent_site.id");
  const currentAssigneeId = watch("assignee.id");

  // Filter users based on selected site's organization
  const filteredUsers = React.useMemo(() => {
    if (!selectedSiteId) return users;

    const selectedSite = sites.find((site) => site.id === selectedSiteId);
    if (!selectedSite?.organization?.id) return users;

    return users.filter(
      (user) => user.organization?.id === selectedSite.organization.id
    );
  }, [selectedSiteId, sites, users]);

  // Clear assignee if current assignee is not in filtered users
  React.useEffect(() => {
    if (currentAssigneeId && filteredUsers.length > 0) {
      const isAssigneeValid = filteredUsers.some(
        (user) => user.id === currentAssigneeId
      );
      if (!isAssigneeValid) {
        setValue("assignee.id", "");
      }
    }
  }, [filteredUsers, currentAssigneeId, setValue]);

  console.log("edit asset", asset);

  React.useEffect(() => {
    if (asset && assetId) {
      reset({
        name: asset?.name || "",
        tag: asset?.tag || "",
        parent_site: { id: asset?.parent_site?.id || "" },
        type: asset?.type || "",
        equipment_class: asset?.equipment_class || "",
        manufacturer: asset?.manufacturer || "",
        is_modified: asset?.is_modified,
        model_number: asset?.model_number || "",
        serial_number: asset?.serial_number || "",
        criticality_level: asset?.criticality_level?.toLowerCase() || "",
        operating_hours: asset?.operating_hours || "",
        commissioned_date:
          dayjs(asset?.commissioned_date).format("YYYY-MM-DD") || "",
        status: asset?.status?.toLowerCase() || "",
        maintenance_strategy: asset?.maintenance_strategy || "",
        last_performed_maintenance:
          dayjs(asset?.last_performed_maintenance).format("YYYY-MM-DD") || "",
        major_overhaul: dayjs(asset?.major_overhaul).format("YYYY-MM-DD") || "",
        last_date_overhaul:
          dayjs(asset?.last_date_overhaul).format("YYYY-MM-DD") || "",
        assignee: { id: asset?.assignee?.id || "" },
        power_rating: extractNumericValue(asset?.power_rating),
        speed: extractNumericValue(asset?.speed),
        capacity: extractNumericValue(asset?.capacity),
        datasheet: asset?.datasheet
          ? {
              file_url: asset.datasheet.file_url || "",
              file_name: asset.datasheet.file_name || "",
              uploaded_at: asset.datasheet.uploaded_at || "",
            }
          : undefined,
      });
    }
  }, [asset, assetId, reset]);

  const handleDeleteFile = async () => {
    if (!existingDatasheetKey) return;

    setIsDeletingFile(true);
    try {
      const response = await deleteFile(existingDatasheetKey);
      if (response.success) {
        toast.success("File deleted successfully");
        setIsFileDeleted(true);
        // Clear datasheet from form
        setValue("datasheet", undefined);
      } else {
        toast.error(
          response.message || "Failed to delete file. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setIsDeletingFile(false);
    }
  };

  const uploadImageFile = async (
    file: File
  ): Promise<{
    file_url: string;
    file_name: string;
    uploaded_at: string;
  } | null> => {
    setIsUploadingImage(true);
    try {
      const response = await uploadImage({ file }, "asset-datasheets");

      if (response.success) {
        // Extract file key from response - same as sign-up flow
        const fileKey = response.data?.data?.file_key;

        if (fileKey && typeof fileKey === "string") {
          // Use the file key directly as file_url (same as sign-up)
          return {
            file_url: fileKey,
            file_name: file.name,
            uploaded_at: new Date().toISOString(),
          };
        }
        toast.error("Failed to get file key from upload response.");
        return null;
      } else {
        toast.error(
          response.message || "Image upload failed. Please try again."
        );
        return null;
      }
    } catch {
      toast.error("Image upload failed. Please try again.");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const appendUnit = (value: string, unit: string) => {
    if (!value) return value;
    const normalized = value.trim();
    if (!normalized) return normalized;
    return normalized.toLowerCase().includes(unit.toLowerCase())
      ? normalized
      : `${normalized} ${unit}`;
  };

  const toTitleCase = (value?: string) =>
    value
      ? value
          .split(" ")
          .map((word) =>
            word.length > 0
              ? word[0].toUpperCase() + word.slice(1).toLowerCase()
              : word
          )
          .join(" ")
      : value;

  const onSubmit = async (data: AddAssetPayload) => {
    // Upload image first if one is selected
    let datasheetData: {
      file_url: string;
      file_name: string;
      uploaded_at: string;
    } | null = null;

    if (datasheetFile) {
      datasheetData = await uploadImageFile(datasheetFile);
      if (!datasheetData) {
        // If image upload fails, stop form submission
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }

    // Prepare the payload with datasheet
    const payload: AddAssetPayload = {
      ...data,
      type: toTitleCase(data.type) as string,
      criticality_level: toTitleCase(data.criticality_level) as string,
      status: toTitleCase(data.status) as string,
      power_rating: appendUnit(data.power_rating, "kW"),
      speed: appendUnit(data.speed, "RPM"),
      capacity: appendUnit(data.capacity, "m³/h"),
      ...(datasheetData
        ? {
            datasheet: {
              ...datasheetData,
              // Use file_key directly as file_url (same as sign-up flow)
              file_url: datasheetData.file_url,
            },
          }
        : // Only keep existing datasheet if file is not deleted
        !isFileDeleted && data.datasheet && data.datasheet.file_name
        ? { datasheet: data.datasheet }
        : {}),
    };

    // Remove datasheet from the object if it's empty, invalid, or deleted
    if (!payload.datasheet || !payload.datasheet.file_name || isFileDeleted) {
      delete payload.datasheet;
    }

    const response = await editAssetService(assetId as string, payload);
    try {
      if (response.success) {
        toast.success("Asset updated successfully", {
          description: `${response.data?.message}`,
        });
        router.push("/assets");
      } else {
        toast.error(
          response.message || "Asset update failed. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Asset update failed. Please try again."
      );
    }
  };

  const handleCancel = () => {
    router.push("/assets");
  };

  return (
    <>
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 border border-gray-200 flex items-center justify-center"
          >
            <Icon icon="mdi:chevron-left" className=" size-5" />
          </button>

          <Text variant="h6">Edit Asset</Text>
        </div>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[827.8px] flex flex-col gap-4"
      >
        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Basic Information</Text>
          <div className="flex flex-col gap-4">
            <Input
              label="Asset Name"
              placeholder="Enter asset name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label="Asset Code/Tag"
              placeholder="Enter asset code/tag"
              {...register("tag")}
              error={errors.tag?.message}
            />

            <Controller
              name="parent_site.id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="col-span-full" label="Site">
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

            <div className="flex flex-col">
              <Text as="span">Asset Type</Text>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <CreatableCombobox
                    options={ASSET_TYPE_OPTIONS}
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Select or type a asset type..."
                    name={field.name}
                  />
                )}
              />
            </div>

            <Input
              label="Equipment Class (Optional)"
              placeholder="Enter equipment class"
              {...register("equipment_class")}
              error={errors.equipment_class?.message}
            />

            <Input
              label="Manufacturer (OEM name)"
              placeholder="Enter manufacturer"
              {...register("manufacturer")}
              error={errors.manufacturer?.message}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm">Upgraded/Modified</label>
              <Controller
                control={control}
                name="is_modified"
                render={({ field }) => (
                  <RadioGroup
                    value={
                      field.value === true
                        ? "true"
                        : field.value === false
                        ? "false"
                        : ""
                    }
                    onValueChange={(val) => field.onChange(val === "true")}
                    className="flex gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="true" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="false" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Model Number"
                placeholder="Enter model number"
                {...register("model_number")}
                error={errors.model_number?.message}
              />

              <Input
                label="Serial Number"
                placeholder="Enter serial number"
                {...register("serial_number")}
                error={errors.serial_number?.message}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Operational Data</Text>
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="criticality_level"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Critical Level">
                    <SelectValue placeholder="Select a critical level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Operting Hours (Since Last Oil Change)"
                placeholder="Enter operating hours"
                {...register("operating_hours")}
                error={errors.operating_hours?.message}
              />
              <Input
                type="date"
                label="Commissioned Date"
                placeholder="Enter commissioned date"
                max={new Date().toISOString().split("T")[0]}
                {...register("commissioned_date")}
                error={errors.commissioned_date?.message}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Maintenance Information</Text>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="col-span-full" label="Asset Status">
                    <SelectValue placeholder="Select a asset status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              label="Maintenance Strategy"
              placeholder="Maintenance date"
              {...register("maintenance_strategy")}
              error={errors.maintenance_strategy?.message}
            />

            <Input
              type="date"
              label="Last Performed Maintenance"
              placeholder="Last performed maintenance"
              max={new Date().toISOString().split("T")[0]}
              {...register("last_performed_maintenance")}
              error={errors.last_performed_maintenance?.message}
            />

            <Input
              type="date"
              label="Major Overhaul Date"
              placeholder="Major overhaul date"
              max={new Date().toISOString().split("T")[0]}
              {...register("major_overhaul")}
              error={errors.major_overhaul?.message}
            />

            <Input
              type="date"
              label="Last Date Overhaul"
              placeholder="Last overhaul date"
              max={new Date().toISOString().split("T")[0]}
              {...register("last_date_overhaul")}
              error={errors.last_date_overhaul?.message}
            />
          </div>
        </section>

        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Ownership</Text>
          <Controller
            control={control}
            name="assignee.id"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="col-span-full" label="Assignee">
                  <SelectValue placeholder="Select a assignee" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </section>

        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Technical Specifications</Text>
          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Power Rating (Kw)"
              placeholder="Enter power rating (Kw)"
              {...register("power_rating")}
              error={errors.power_rating?.message}
            />
            <Input
              type="number"
              label="Speed (RPM)"
              placeholder="Enter speed (RPM)"
              {...register("speed")}
              error={errors.speed?.message}
            />
            <Input
              type="number"
              label="Capacity (m3/h)"
              placeholder="Enter capacity (m3/h)"
              {...register("capacity")}
              error={errors.capacity?.message}
            />
          </div>
        </section>

        <div className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Asset Datasheet</Text>

          {/* Show existing file if available and not deleted */}
          {existingDatasheetKey && !isFileDeleted && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDatasheetLoading ? (
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="hugeicons:loading-01"
                        className="w-5 h-5 animate-spin text-gray-400"
                      />
                      <Text variant="span" className="text-sm text-gray-600">
                        Loading file...
                      </Text>
                    </div>
                  ) : datasheetUrl ? (
                    <>
                      <a
                        href={datasheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <Icon icon="mdi:file-document" className="w-5 h-5" />
                        <Text variant="span" className="text-sm font-medium">
                          {asset?.datasheet?.file_name || "View Datasheet"}
                        </Text>
                        <Icon icon="mdi:open-in-new" className="w-4 h-4" />
                      </a>
                    </>
                  ) : (
                    <Text variant="span" className="text-sm text-gray-600">
                      {asset?.datasheet?.file_name || "Datasheet"}
                    </Text>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={handleDeleteFile}
                  loading={isDeletingFile}
                  className="text-red-600 hover:text-red-700 border-red-300"
                >
                  <Icon icon="mdi:delete" className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* File uploader for new file */}
          {(!existingDatasheetKey || isFileDeleted) && (
            <FileUploader
              label="Upload Asset Datasheet"
              value={datasheetFile}
              onChange={setDatasheetFile}
              id="datasheet"
            />
          )}

          {/* Option to replace existing file */}
          {existingDatasheetKey && !isFileDeleted && (
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => {
                  setIsFileDeleted(true);
                  setValue("datasheet", undefined);
                }}
              >
                Replace File
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting || isUploadingImage}>
            {isUploadingImage ? "Uploading Image..." : "Update Asset"}
          </Button>
        </div>
      </form>
    </>
  );
};
