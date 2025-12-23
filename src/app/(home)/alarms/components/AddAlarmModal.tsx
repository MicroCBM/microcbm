"use client";

import React from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetTrigger,
  SheetFooter,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { addAlarmService } from "@/app/actions";
import { toast } from "sonner";
import { Icon } from "@/libs";
import Input from "@/components/input/Input";
import { ADD_ALARM_SCHEMA, AddAlarmPayload } from "@/schema";
import { Sites } from "@/types";
import ComboSelect from "@/components/combo-select/ComboSelect";
import { DropdownOption, transformStrToDropdownOptions } from "@/utils/helpers";

type FormData = z.infer<typeof ADD_ALARM_SCHEMA>;

interface AddAlarmModalProps {
  sites: Sites[];
}

// Mock recommendation options - in a real app, these would come from an API
const recommendationOptions = [
  "rec-001",
  "rec-002",
  "rec-003",
  "rec-004",
  "rec-005",
];

export const AddAlarmModal = ({ sites }: AddAlarmModalProps) => {
  const [isAddAlarmModalOpen, setIsAddAlarmModalOpen] = React.useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_ALARM_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      acknowledged_status: false,
    },
  });

  console.log("errors in add alarm modal", errors);

  const onSubmit = async (data: AddAlarmPayload) => {
    try {
      // Convert datetime-local to RFC3339 format
      const firstDetected = data.first_detected
        ? new Date(data.first_detected).toISOString().replace(/\.\d{3}Z$/, "Z")
        : new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

      const payload = {
        alarm: {
          ...data,
          first_detected: firstDetected, // This overwrites the data.first_detected
        },
      };

      console.log("payload in add alarm modal", payload);
      console.log(
        "payload.alarm.first_detected:",
        payload.alarm.first_detected
      );

      const response = await addAlarmService(payload.alarm);
      if (response.success) {
        toast.success("Alarm created successfully", {
          description: "The alarm has been added to your list.",
        });
        reset();
        setIsAddAlarmModalOpen(false);
      } else {
        console.log("response in add alarm modal", response.message);
        toast.error(
          response.message || "Failed to create alarm. Please try again."
        );
      }
    } catch (error) {
      console.error("error in add alarm modal", error);
      toast.error(
        (error as Error).message || "Failed to create alarm. Please try again."
      );
    }
  };
  return (
    <>
      <Sheet open={isAddAlarmModalOpen} onOpenChange={setIsAddAlarmModalOpen}>
        <SheetTrigger asChild>
          <Button
            permissions="alarms:create"
            onClick={() => setIsAddAlarmModalOpen(true)}
            size="medium"
            className="rounded-full cursor-pointer"
          >
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Alarm
          </Button>
        </SheetTrigger>
        <SheetContent className="!max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Add New Alarm</SheetTitle>
          </SheetHeader>

          <form
            id="add-alarm-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full px-6 overflow-y-auto gap-4"
          >
            <Input
              label="Parameter"
              placeholder="Enter alarm parameter (e.g., Temperature, Pressure)"
              {...register("parameter")}
              error={errors.parameter?.message}
            />

            <Controller
              control={control}
              name="site.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Site">
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

            <Input
              type="datetime-local"
              label="First Detected"
              {...register("first_detected")}
              error={errors.first_detected?.message}
            />

            <Controller
              control={control}
              name="acknowledged_status"
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => field.onChange(value === "true")}
                >
                  <SelectTrigger label="Acknowledged Status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Unacknowledged</SelectItem>
                    <SelectItem value="true">Acknowledged</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <ComboSelect
              isSearchable
              label="Linked Recommendations (Optional)"
              placeholder="Select recommendations..."
              options={transformStrToDropdownOptions(recommendationOptions)}
              isMulti
              defaultValue={[]}
              onChange={(options) => {
                const selectedOptions = options as DropdownOption[];
                const linkedRecommendations = selectedOptions.map((option) => ({
                  id: option.value,
                }));
                setValue("linked_recommendations", linkedRecommendations);
              }}
              error={errors.linked_recommendations?.message}
            />
          </form>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddAlarmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="add-alarm-form" loading={isSubmitting}>
              Create Alarm
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
