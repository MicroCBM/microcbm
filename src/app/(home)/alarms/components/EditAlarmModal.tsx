"use client";

import React from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
  SheetFooter,
} from "@/components";
import { EDIT_ALARM_SCHEMA, EditAlarmPayload } from "@/schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alarm, Sites } from "@/types";
import { editAlarmService } from "@/app/actions";
import { toast } from "sonner";
import Input from "@/components/input/Input";
import ComboSelect from "@/components/combo-select/ComboSelect";
import { DropdownOption, transformStrToDropdownOptions } from "@/utils/helpers";

type FormData = z.infer<typeof EDIT_ALARM_SCHEMA>;

interface EditAlarmModalProps {
  alarm: Alarm;
  alarmId: string;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
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

export const EditAlarmModal = ({
  alarm,
  alarmId,
  isEditModalOpen,
  setIsEditModalOpen,
  sites,
}: EditAlarmModalProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(EDIT_ALARM_SCHEMA),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (alarm) {
      // Convert RFC3339 format to datetime-local format for the input
      const firstDetected = alarm?.first_detected
        ? new Date(alarm.first_detected).toISOString().slice(0, 16)
        : "";

      reset({
        parameter: alarm?.parameter || "",
        site: {
          id: alarm?.site?.id || "",
        },
        first_detected: firstDetected,
        acknowledged_status: alarm?.acknowledged_status || false,
        linked_recommendations: alarm?.linked_recommendations || [],
      });
    }
  }, [alarm, reset]);

  const onSubmit = async (data: EditAlarmPayload) => {
    try {
      // Convert datetime-local to RFC3339 format
      const firstDetected = data.first_detected
        ? new Date(data.first_detected).toISOString()
        : new Date().toISOString();

      const payload = {
        ...data,
        first_detected: firstDetected,
        linked_recommendations: data.linked_recommendations || [],
      };

      const response = await editAlarmService(alarmId, payload);
      if (response.success) {
        toast.success("Alarm updated successfully", {
          description: `${response.data?.message}`,
        });
        setIsEditModalOpen(false);
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Alarm update failed. Please try again."
      );
    }
  };

  return (
    <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <SheetContent className="!max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Alarm</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 p-6 flex flex-col gap-4">
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
              defaultValue={
                alarm?.linked_recommendations
                  ? transformStrToDropdownOptions(
                      alarm.linked_recommendations.map((rec) => rec.id)
                    )
                  : []
              }
              onChange={(options) => {
                const selectedOptions = options as DropdownOption[];
                const linkedRecommendations = selectedOptions.map((option) => ({
                  id: option.value,
                }));
                setValue("linked_recommendations", linkedRecommendations);
              }}
              error={errors.linked_recommendations?.message}
            />
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button loading={isSubmitting}>Update Alarm</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
