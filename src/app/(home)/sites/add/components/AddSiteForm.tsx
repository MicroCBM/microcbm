"use client";
import {
  SelectValue,
  Button,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select,
  Text,
  PhoneInput,
} from "@/components";
import { ADD_SITES_SCHEMA, AddSitesPayload } from "@/schema";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Input from "@/components/input/Input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSiteService, uploadImage } from "@/app/actions";
import * as RPNInput from "react-phone-number-input";
import CountrySelect from "@/components/country-select/CountrySelect";
import RegionSelect from "@/components/region-select/RegionSelect";
import { Icon } from "@/libs";
import { Organization } from "@/types";
import { CreatableCombobox } from "@/components";
import { DropdownOption, transformStrToDropdownOptions } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";

type FormData = z.infer<typeof ADD_SITES_SCHEMA>;

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

export const AddSiteForm = ({
  organizations,
  users,
}: {
  organizations: Organization[];
  users: UserType[];
}) => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_SITES_SCHEMA),
    mode: "onSubmit",
  });

  const selectedCountry = watch("country");
  const selectedOrganization = watch("organization");
  const previousCountryRef = useRef<string | undefined>(selectedCountry);
  const previousOrganizationRef = useRef<string | undefined>(
    selectedOrganization?.id
  );

  // Clear region when country changes
  useEffect(() => {
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
  useEffect(() => {
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

  const uploadImageFile = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    try {
      const response = await uploadImage({ file }, "site-attachments");

      if (response.success) {
        // Extract file key from response
        const fileKey = response.data?.data?.file_key;

        if (fileKey && typeof fileKey === "string") {
          // Return the file key as URL (same pattern as other forms)
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

  const onSubmit = async (data: AddSitesPayload) => {
    // Upload attachment if one is selected
    let siteMapUrl: string | null = null;

    if (attachmentFile) {
      siteMapUrl = await uploadImageFile(attachmentFile);
      if (!siteMapUrl) {
        // If file upload fails, stop form submission
        toast.error("File upload failed. Please try again.");
        return;
      }
    }

    // Prepare the payload with attachment
    const payload: AddSitesPayload = {
      ...data,
      ...(siteMapUrl
        ? {
            attachments: [
              {
                site_map: siteMapUrl,
              },
            ],
          }
        : {}),
    };

    console.log("submit data", payload);
    const response = await addSiteService(payload);
    try {
      if (response.success) {
        toast.success("Asset added successfully", {
          description: `${response.data?.message}`,
        });
        router.push("/sites");
      } else {
        toast.error(
          response.message || "Asset addition failed. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Asset addition failed. Please try again."
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

          <Text variant="h6">Add Site</Text>
        </div>

        <div className="flex items-center gap-2">
          <Button size="medium" variant="outline">
            Discard
          </Button>
          <Button size="medium" variant="outline">
            Save Draft
          </Button>
          <Button size="medium">Create Site</Button>
        </div>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[827.8px] p-6 flex flex-col gap-4"
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
                    !regulationsOptions.some((option) => option.value === value)
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
                  <SelectTrigger className="col-span-full" label="Organization">
                    <SelectValue placeholder="Select a organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((organization) => (
                      <SelectItem key={organization.id} value={organization.id}>
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
                          setValue("manager_email", selectedUser.email || "", {
                            shouldDirty: false,
                          });
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

        <div className="flex flex-col gap-6 border border-gray-100 p-6">
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

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting || isUploadingImage}>
            Create Site
          </Button>
        </div>
      </form>
    </>
  );
};
