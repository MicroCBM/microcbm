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
import Input from "@/components/input/Input";
import { EDIT_SITE_SCHEMA, EditSitePayload } from "@/schema";
import { Organization, Sites } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as RPNInput from "react-phone-number-input";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import ComboSelect from "@/components/combo-select/ComboSelect";
import { DropdownOption, transformStrToDropdownOptions } from "@/utils";
import { editSiteService } from "@/app/actions";

const regulationsAndStandardsOptions = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 50001",
  "ISO 27001",
  "ISO 22301",
];

export const EditSite = ({
  site,
  isOpen,
  onClose,
  organizations,
}: {
  site: Sites | null;
  isOpen: boolean;
  onClose: () => void;
  organizations: Organization[];
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    reset,
    setValue,
  } = useForm<EditSitePayload>({
    resolver: zodResolver(EDIT_SITE_SCHEMA),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!site) return;
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
    try {
      const result = await editSiteService(site?.id as string, data);
      if (result.success) {
        toast.success("Site updated successfully!", {
          description: `${result.data?.message}`,
        });
        onClose();
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
        <SheetContent className="!max-w-[540px]">
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

                  <Input
                    label="Region/State"
                    placeholder="Enter region or state"
                    error={errors.city?.message}
                    {...register("city")}
                  />

                  <Input
                    label="Address"
                    placeholder="Enter address"
                    className="col-span-full"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>

                <ComboSelect
                  isSearchable
                  label="Regulations and Standards"
                  placeholder="Select regulations and standards..."
                  options={transformStrToDropdownOptions(
                    regulationsAndStandardsOptions
                  )}
                  isMulti
                  defaultValue={transformStrToDropdownOptions(
                    site?.regulations_and_standards || []
                  )}
                  onChange={(options) => {
                    const values = (options as DropdownOption[]).map(
                      (option) => option.value
                    );
                    setValue("regulations_and_standards", values);
                  }}
                  error={errors.regulations_and_standards?.message}
                />
              </div>
            </section>

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p">Contact Information</Text>
              <div className="flex flex-col gap-4">
                <Input
                  label="Site Manager name"
                  placeholder="Enter full name of the site manager (e.g. John Doe)"
                  {...register("manager_name")}
                  error={errors.manager_name?.message}
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
              {/* here is where you can upload the image */}
              <Input
                type="file"
                label="Upload Image"
                placeholder="Upload image"
              />
            </div>

            <SheetFooter>
              <Button type="button" variant="outline">
                Discard
              </Button>
              <Button
                type="submit"
                form="edit-site-form"
                loading={isSubmitting}
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
