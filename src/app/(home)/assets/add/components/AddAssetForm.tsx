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
} from "@/components";
import { ADD_ASSET_SCHEMA, AddAssetPayload } from "@/schema";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Input from "@/components/input/Input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAssetService } from "@/app/actions";

type FormData = z.infer<typeof ADD_ASSET_SCHEMA>;

export const AddAssetForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_ASSET_SCHEMA),
    mode: "onSubmit",
  });

  console.log("errors", errors);

  const onSubmit = async (data: AddAssetPayload) => {
    console.log("submit data", data);
    const response = await addAssetService(data);
    try {
      if (response.success) {
        toast.success("Asset added successfully", {
          description: `${response.data?.message}`,
        });
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[827.8px] p-6 flex flex-col gap-4"
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
            control={control}
            name="parent_site"
            render={({ field }) => (
              <Select
                value={field.value?.id as string}
                onValueChange={(val) => field.onChange({ id: val })}
              >
                <SelectTrigger label="Parent Site">
                  <SelectValue placeholder="Select a parent site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wear-metals">Wear Metals</SelectItem>
                  <SelectItem value="contaminants">Contamination</SelectItem>
                  <SelectItem value="additives-and-lubricants">
                    Additives & Lubricants
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value as string}
                onValueChange={field.onChange}
              >
                <SelectTrigger label="Asset Type">
                  <SelectValue placeholder="Select a asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compressor">Compressor</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="gearbox">Gearbox</SelectItem>
                  <SelectItem value="valve">Valve</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

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
            name="critical_level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
              type="time"
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
                value={field.value as string}
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
          name="assignee"
          render={({ field }) => (
            <Select
              value={field.value?.id as string}
              onValueChange={(val) => field.onChange({ id: val })}
            >
              <SelectTrigger className="col-span-full" label="Assignee">
                <SelectValue placeholder="Select a assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">John Doe</SelectItem>
                <SelectItem value="2">Jane Smith</SelectItem>
                <SelectItem value="3">Mike Johnson</SelectItem>
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
        {/* here is where you can upload the image */}
        <Input type="file" label="Upload Image" placeholder="Upload image" />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Create Asset
        </Button>
      </div>
    </form>
  );
};
