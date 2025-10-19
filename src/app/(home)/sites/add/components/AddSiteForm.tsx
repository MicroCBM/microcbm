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
import { addSiteService } from "@/app/actions";
import * as RPNInput from "react-phone-number-input";
import CountrySelect from "@/components/country-select/CountrySelect";
import { Icon } from "@/libs";
import { Organization } from "@/types";
import ComboSelect from "@/components/combo-select/ComboSelect";
import { DropdownOption, transformStrToDropdownOptions } from "@/utils/helpers";

type FormData = z.infer<typeof ADD_SITES_SCHEMA>;

const regulationsAndStandardsOptions = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 50001",
  "ISO 27001",
  "ISO 22301",
];

export const AddSiteForm = ({
  organizations,
}: {
  organizations: Organization[];
}) => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_SITES_SCHEMA),
    mode: "onSubmit",
  });

  function handleMulti(options: DropdownOption[]) {
    setValue(
      "regulations_and_standards",
      options.map((option) => option.value)
    );
  }

  const onSubmit = async (data: AddSitesPayload) => {
    console.log("submit data", data);
    const response = await addSiteService(data);
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
              defaultValue={[]}
              onChange={(options) => handleMulti(options as DropdownOption[])}
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

        <div className="flex flex-col gap-6 border border-gray-100 p-6">
          {/* here is where you can upload the image */}
          <Input type="file" label="Upload Image" placeholder="Upload image" />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create Site
          </Button>
        </div>
      </form>
    </>
  );
};
