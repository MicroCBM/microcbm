"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
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
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alarm, Sites, Recommendation } from "@/types";
import {
  editAlarmService,
  getAlarmService,
  getSitesService,
  getRecommendationsService,
} from "@/app/actions";
import { toast } from "sonner";
import Input from "@/components/input/Input";
import { CreatableCombobox } from "@/components";
import { DropdownOption } from "@/utils/helpers";
import { EDIT_ALARM_SCHEMA, EditAlarmPayload } from "@/schema";
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";

type FormData = z.infer<typeof EDIT_ALARM_SCHEMA>;

export function EditAlarmModal() {
  const router = useRouter();
  const modal = usePersistedModalState<{ alarm: Alarm }>({
    paramName: MODALS.ALARM.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.ALARM.CHILDREN.EDIT);
  const alarmFromModal = modal.modalData?.alarm;

  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [sites, setSites] = useState<Sites[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(EDIT_ALARM_SCHEMA),
    mode: "onSubmit",
  });

  // Fetch alarm and related data when modal opens
  useEffect(() => {
    if (!isOpen || !alarmFromModal?.id) return;

    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        const [alarmData, sitesData, recommendationsData] = await Promise.all([
          getAlarmService(alarmFromModal.id),
          getSitesService(),
          getRecommendationsService({}),
        ]);

        setAlarm(alarmData);
        setSites(sitesData);
        setRecommendations(recommendationsData);

        // Convert RFC3339 format to datetime-local format for the input
        const firstDetected = alarmData?.first_detected
          ? new Date(alarmData.first_detected).toISOString().slice(0, 16)
          : "";

        reset({
          parameter: alarmData?.parameter || "",
          site: {
            id: alarmData?.site?.id || "",
          },
          first_detected: firstDetected,
          acknowledged_status: alarmData?.acknowledged_status || false,
          linked_recommendations: alarmData?.linked_recommendations || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load alarm data");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isOpen, alarmFromModal?.id, reset]);

  // Create selectable options from recommendations
  const recommendationOptions: DropdownOption[] = React.useMemo(() => {
    return recommendations.map((rec) => ({
      label: rec.title || rec.id,
      value: rec.id,
    }));
  }, [recommendations]);

  const onSubmit = async (data: EditAlarmPayload) => {
    if (!alarm) return;

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

      const response = await editAlarmService(alarm.id, payload);
      if (response.success) {
        toast.success("Alarm updated successfully", {
          description: `${response.data?.message}`,
        });
        modal.closeModal();
        router.refresh();
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Alarm update failed. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={modal.closeModal}>
      <SheetContent className="max-w-[540px]!">
        <SheetHeader>
          <SheetTitle>Edit Alarm</SheetTitle>
        </SheetHeader>

        {isFetchingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
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

              <Controller
                control={control}
                name="linked_recommendations"
                render={({ field }) => (
                  <CreatableCombobox
                    label="Linked Recommendations (Optional)"
                    placeholder="Select or create recommendations..."
                    options={recommendationOptions}
                    isMulti
                    value={
                      field.value
                        ? field.value.map((rec: { id: string }) => ({
                            value: rec.id,
                            label:
                              recommendations.find((r) => r.id === rec.id)
                                ?.title || rec.id,
                          }))
                        : []
                    }
                    onChange={(options) => {
                      const selectedOptions = options as DropdownOption[];
                      const linkedRecommendations = selectedOptions.map(
                        (option) => ({
                          id: option.value,
                        })
                      );
                      field.onChange(linkedRecommendations);
                    }}
                    error={errors.linked_recommendations?.message}
                  />
                )}
              />
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={modal.closeModal}
              >
                Cancel
              </Button>
              <Button loading={isSubmitting} disabled={isSubmitting}>
                Update Alarm
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
