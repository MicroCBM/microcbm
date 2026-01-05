"use client";
import {
  Button,
  PhoneInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Text,
} from "@/components";
import CountrySelect from "@/components/country-select/CountrySelect";
import RegionSelect from "@/components/region-select/RegionSelect";
import Input from "@/components/input/Input";
import { EDIT_SITE_SCHEMA, EditSitePayload } from "@/schema";
import { Organization, Sites } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as RPNInput from "react-phone-number-input";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreatableCombobox } from "@/components";
import { DropdownOption, transformStrToDropdownOptions } from "@/utils";
import { editSiteService, uploadImage, deleteFile } from "@/app/actions";
import { usePresignedUrl } from "@/hooks";
import Image from "next/image";
import { useState } from "react";

const regulationsAndStandardsOptions = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 50001",
  "ISO 27001",
  "ISO 22301",
];

interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization?: {
    id: string;
    name: string;
  };
}

export const EditSite = ({
  site,
  isOpen,
  onClose,
  organizations,
  users,
}: {
  site: Sites | null;
  isOpen: boolean;
  onClose: () => void;
  organizations: Organization[];
  users: UserType[];
}) => {
  console.log("site information", site);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    reset,
    setValue,
    watch,
  } = useForm<EditSitePayload>({
    resolver: zodResolver(EDIT_SITE_SCHEMA),
    mode: "onSubmit",
  });

  const selectedCountry = watch("country");
  const selectedOrganization = watch("organization");
  const previousCountryRef = React.useRef<string | undefined>(selectedCountry);
  const previousOrganizationRef = React.useRef<string | undefined>(
    selectedOrganization?.id
  );

  // Clear region when country changes
  React.useEffect(() => {
    if (
      previousCountryRef.current !== selectedCountry &&
      previousCountryRef.current !== undefined
    ) {
      setValue("city", "", { shouldDirty: false });
    }
    previousCountryRef.current = selectedCountry;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // Clear manager name when organization changes
  React.useEffect(() => {
    if (
      previousOrganizationRef.current !== selectedOrganization?.id &&
      previousOrganizationRef.current !== undefined
    ) {
      setValue("manager_name", "", { shouldDirty: false });
    }
    previousOrganizationRef.current = selectedOrganization?.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganization?.id]);

  // Filter users by selected organization
  const organizationUsers = selectedOrganization?.id
    ? users.filter((user) => user.organization?.id === selectedOrganization.id)
    : [];

  // Transform users to dropdown options
  const userOptions: DropdownOption[] = organizationUsers.map((user) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: `${user.first_name} ${user.last_name}`,
  }));

  const regulationsOptions = transformStrToDropdownOptions(
    regulationsAndStandardsOptions
  );

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isFileDeleted, setIsFileDeleted] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);

  // Get existing site_map file key from attachments
  const existingSiteMapKey =
    site?.attachments &&
    Array.isArray(site.attachments) &&
    site.attachments.length > 0
      ? (site.attachments[0] as { site_map?: string })?.site_map
      : null;

  // Get presigned URL for existing site map
  const { url: existingSiteMapUrl, isLoading: isSiteMapLoading } =
    usePresignedUrl(
      existingSiteMapKey && !isFileDeleted ? existingSiteMapKey : null,
      !!existingSiteMapKey && !isFileDeleted && isOpen
    );

  const uploadImageFile = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    try {
      const response = await uploadImage({ file }, "site-attachments");

      if (response.success) {
        const fileKey = response.data?.data?.file_key;

        if (fileKey && typeof fileKey === "string") {
          return fileKey;
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

  const handleDeleteFile = async () => {
    if (!existingSiteMapKey) return;

    setIsDeletingFile(true);
    try {
      const response = await deleteFile(existingSiteMapKey);
      if (response.success) {
        setIsFileDeleted(true);
        setAttachmentFile(null);
        // Clear attachments from form
        setValue("attachments", undefined);
        toast.success("File deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete file");
      }
    } catch {
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setIsDeletingFile(false);
    }
  };

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsFileDeleted(false);
      setAttachmentFile(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!site) return;
    // Reset file-related state when site changes
    setIsFileDeleted(false);
    setAttachmentFile(null);

    reset({
      name: site.name,
      tag: site.tag,
      description: site.description,
      installation_enviroment: site.installation_environment,
      country: site.country,
      city: site.city,
      address: site.address,
      regulations_and_standards: site.regulations_and_standards,
      organization: {
        id: site.organization.id,
      },
      manager_name: site.manager_name,
      manager_email: site.manager_email,
      manager_phone_number: site.manager_phone_number,
      manager_location: site.manager_location,
      attachments: site.attachments as unknown as {
        site_map?: string | undefined;
        permits?: (string | undefined)[];
      }[],
    });
  }, [site, reset]);

  const onSubmit = async (data: EditSitePayload) => {
    // Delete existing file if marked for deletion and no new file is being uploaded
    if (isFileDeleted && existingSiteMapKey && !attachmentFile) {
      try {
        await deleteFile(existingSiteMapKey);
      } catch (error) {
        console.error("Error deleting existing file:", error);
        // Continue with submission even if deletion fails
      }
    }

    // Upload new attachment if one is selected
    let siteMapUrl: string | null = null;

    if (attachmentFile) {
      // If there's an existing file and we're uploading a new one, delete the old one first
      if (existingSiteMapKey && !isFileDeleted) {
        try {
          await deleteFile(existingSiteMapKey);
        } catch (error) {
          console.error("Error deleting old file:", error);
          // Continue with upload even if deletion fails
        }
      }

      siteMapUrl = await uploadImageFile(attachmentFile);
      if (!siteMapUrl) {
        // If file upload fails, stop form submission
        toast.error("File upload failed. Please try again.");
        return;
      }
    }

    // Prepare the payload with attachment
    const payload: EditSitePayload = {
      ...data,
      ...(siteMapUrl
        ? {
            // New file uploaded
            attachments: [
              {
                site_map: siteMapUrl,
              },
            ],
          }
        : isFileDeleted
        ? {
            // File was deleted
            attachments: [],
          }
        : existingSiteMapKey
        ? {
            // Preserve existing attachment if no changes
            attachments: [
              {
                site_map: existingSiteMapKey,
              },
            ],
          }
        : {}),
    };

    try {
      const result = await editSiteService(site?.id as string, payload);
      if (result.success) {
        toast.success("Site updated successfully!", {
          description: `${result.data?.message}`,
        });
        // Reset file-related state after successful update
        setIsFileDeleted(false);
        setAttachmentFile(null);
        onClose();
        // Refresh the page to get updated site data
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to update site");
      }
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error("An error occurred while updating the site");
    }
  };

  if (!site) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="!max-w-[840px]">
          <SheetHeader>
            <SheetTitle>Edit Site</SheetTitle>
          </SheetHeader>
          <form
            id="edit-site-form"
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[827.8px] p-6 flex flex-col gap-4 overflow-y-auto"
          >
            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p">Basic Information</Text>
              <div className="flex flex-col gap-4">
                <Input
                  label="Site Name"
                  placeholder="Enter asset name"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="Site Code/Tag"
                  placeholder="Enter site code/tag"
                  {...register("tag")}
                  error={errors.tag?.message}
                />

                <Input
                  label="Description (Optional)"
                  placeholder="Detailed description of the issue, analysis, and recommended actions..."
                  type="textarea"
                  rows={4}
                  {...register("description")}
                  error={errors.description?.message}
                />

                <Input
                  label="Installation Enviroment (Optional)"
                  placeholder="Describe the installation environment, including temperature, pressure, and other relevant factors."
                  type="textarea"
                  rows={4}
                  {...register("installation_enviroment")}
                  error={errors.installation_enviroment?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <CountrySelect
                        className="col-span-full w-full"
                        label="Country"
                        placeholder="Country"
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <RegionSelect
                        country={selectedCountry}
                        label="Region/State"
                        className="col-span-full w-full"
                        placeholder="Select region or state"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.city?.message}
                      />
                    )}
                  />

                  <Input
                    label="Address"
                    placeholder="Enter address"
                    className="col-span-full"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>

                <Controller
                  control={control}
                  name="regulations_and_standards"
                  render={({ field }) => {
                    const selectedValues = field.value || [];
                    // Find options from the predefined list
                    const selectedFromOptions = regulationsOptions.filter(
                      (option) => selectedValues.includes(option.value)
                    );
                    // Find values that aren't in the predefined options (newly created)
                    const createdValues = selectedValues.filter(
                      (value) =>
                        !regulationsOptions.some(
                          (option) => option.value === value
                        )
                    );
                    // Create options for newly created values
                    const createdOptions = createdValues.map((value) => ({
                      label: value,
                      value: value,
                    }));
                    // Combine both
                    const selectedOptions = [
                      ...selectedFromOptions,
                      ...createdOptions,
                    ];

                    return (
                      <CreatableCombobox
                        isSearchable
                        label="Regulations and Standards"
                        placeholder="Select regulations and standards..."
                        options={regulationsOptions}
                        isMulti
                        value={selectedOptions}
                        onChange={(options) => {
                          // For multi-select, CreatableCombobox passes array of DropdownOption directly
                          const selectedOptions = options as
                            | DropdownOption[]
                            | null;
                          const values = selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : [];
                          field.onChange(values);
                        }}
                        error={errors.regulations_and_standards?.message}
                      />
                    );
                  }}
                />
              </div>
            </section>

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p">Contact Information</Text>
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="manager_name"
                  render={({ field }) => {
                    const selectedValue = field.value || "";

                    return (
                      <CreatableCombobox
                        label="Site Manager name"
                        placeholder={
                          !selectedOrganization?.id
                            ? "Select an organization first"
                            : "Select or create site manager name"
                        }
                        options={userOptions}
                        value={selectedValue}
                        onChange={(event: unknown) => {
                          // For single select, CreatableCombobox passes { target: { value, name } }
                          const eventObj = event as {
                            target?: { value?: string };
                            value?: string;
                            label?: string;
                          } | null;
                          const value =
                            eventObj?.target?.value ??
                            eventObj?.value ??
                            eventObj?.label ??
                            "";
                          field.onChange(value);

                          // If a user is selected (not a newly created value), populate phone and email
                          if (value) {
                            const selectedUser = organizationUsers.find(
                              (user) =>
                                `${user.first_name} ${user.last_name}` === value
                            );
                            if (selectedUser) {
                              setValue(
                                "manager_phone_number",
                                selectedUser.phone || "",
                                {
                                  shouldDirty: false,
                                }
                              );
                              setValue(
                                "manager_email",
                                selectedUser.email || "",
                                {
                                  shouldDirty: false,
                                }
                              );
                            } else {
                              // If it's a newly created value, clear phone and email
                              setValue("manager_phone_number", "", {
                                shouldDirty: false,
                              });
                              setValue("manager_email", "", {
                                shouldDirty: false,
                              });
                            }
                          }
                        }}
                        error={errors.manager_name?.message}
                        isDisabled={!selectedOrganization?.id}
                      />
                    );
                  }}
                />

                <Controller
                  control={control}
                  name="manager_phone_number"
                  render={({ field }) => (
                    <PhoneInput
                      className="col-span-full"
                      defaultCountry="GH"
                      placeholder="(123) 456-7890"
                      value={field.value as RPNInput.Value}
                      onChange={field.onChange}
                      error={errors.manager_phone_number?.message}
                    />
                  )}
                />

                <Input
                  label="Email Address"
                  placeholder="Enter email address"
                  {...register("manager_email")}
                  error={errors.manager_email?.message}
                />
                <Input
                  label="Location (Optional)"
                  {...register("manager_location")}
                  placeholder="Enter location"
                  error={errors.manager_location?.message}
                />
              </div>
            </section>

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p">Organizational Fields</Text>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="organization"
                  render={({ field }) => (
                    <Select
                      value={field.value?.id as string}
                      onValueChange={(value) => {
                        field.onChange({ id: value });
                      }}
                    >
                      <SelectTrigger
                        className="col-span-full"
                        label="Organization"
                      >
                        <SelectValue placeholder="Select a organization" />
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
                  )}
                />
              </div>
            </section>

            <div className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p">Site Map</Text>

              {/* Show existing file if available and not deleted */}
              {existingSiteMapKey && !isFileDeleted && (
                <div className="flex flex-col gap-4">
                  {isSiteMapLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Text variant="p" className="text-gray-600 text-sm">
                        Loading image...
                      </Text>
                    </div>
                  ) : existingSiteMapUrl ? (
                    <div className="flex flex-col gap-2">
                      <a
                        href={existingSiteMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Image
                          src={existingSiteMapUrl}
                          alt="Site map"
                          width={500}
                          height={300}
                          className="w-full h-auto rounded-lg border border-gray-200 object-contain"
                          unoptimized
                        />
                      </a>
                      <div className="flex items-center justify-between">
                        <Text variant="p" className="text-gray-900 text-xs">
                          Current Site Map
                        </Text>
                        <Button
                          type="button"
                          variant="outline"
                          size="small"
                          onClick={handleDeleteFile}
                          loading={isDeletingFile}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Text variant="p" className="text-gray-600 text-sm">
                      Unable to load image
                    </Text>
                  )}
                </div>
              )}

              {/* Upload new file */}
              {(!existingSiteMapKey || isFileDeleted) && (
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    label="Upload Image"
                    placeholder="Upload image"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAttachmentFile(file);
                      }
                    }}
                  />
                  {attachmentFile && (
                    <Text variant="p" className="text-sm text-gray-600">
                      Selected: {attachmentFile.name}
                    </Text>
                  )}
                </div>
              )}
            </div>

            <SheetFooter>
              <Button type="button" variant="outline">
                Discard
              </Button>
              <Button
                type="submit"
                form="edit-site-form"
                loading={isSubmitting || isUploadingImage}
              >
                Update Site
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};
