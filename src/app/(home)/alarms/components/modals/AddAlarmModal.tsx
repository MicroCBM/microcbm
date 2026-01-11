"use client";

import React, { useEffect, useState } from "react";
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
  SheetFooter,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { addAlarmService, getUsersService } from "@/app/actions";
import { toast } from "sonner";
import { Icon } from "@/libs";
import Input from "@/components/input/Input";
import { ADD_ALARM_SCHEMA, AddAlarmPayload } from "@/schema";
import { Sites, Recommendation } from "@/types";
import { CreatableCombobox } from "@/components";
import { DropdownOption } from "@/utils/helpers";
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";
import { useRouter } from "next/navigation";
import { getRecommendationsService } from "@/app/actions";

type FormData = z.infer<typeof ADD_ALARM_SCHEMA>;

interface AddAlarmModalProps {
  sites: Sites[];
}

interface USER_TYPE {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  site?: {
    id: string;
  };
}

export const AddAlarmModal = ({ sites: initialSites }: AddAlarmModalProps) => {
  const router = useRouter();
  const modal = usePersistedModalState({
    paramName: MODALS.ALARM.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.ALARM.CHILDREN.CREATE);
  const [sites] = useState<Sites[]>(initialSites);
  const [users, setUsers] = useState<USER_TYPE[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_ALARM_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      acknowledged_status: false,
    },
  });

  const selectedSiteId = watch("site.id");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Fetch users and recommendations when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoadingUsers(true);
        try {
          const [usersData, recommendationsData] = await Promise.all([
            getUsersService(),
            getRecommendationsService({}),
          ]);
          setUsers(usersData as USER_TYPE[]);
          setRecommendations(recommendationsData);
        } catch (error) {
          toast.error((error as string) || "Failed to load data");
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Create selectable options from recommendations
  const recommendationOptions: DropdownOption[] = React.useMemo(() => {
    return recommendations.map((rec) => ({
      label: rec.title || rec.id,
      value: rec.id,
    }));
  }, [recommendations]);

  // Filter users based on selected site
  const filteredUsers = React.useMemo(() => {
    if (!selectedSiteId) return [];
    return users.filter((user) => user.site?.id === selectedSiteId);
  }, [selectedSiteId, users]);

  // Clear selected user when site changes
  useEffect(() => {
    setSelectedUserId("");
  }, [selectedSiteId]);

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
        modal.closeModal();
        router.refresh();
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
      <Button
        permissions="alarms:create"
        onClick={() => modal.openModal(MODALS.ALARM.CHILDREN.CREATE)}
        size="medium"
        className="rounded-full cursor-pointer"
      >
        <Icon icon="mdi:plus-circle" className="text-white size-5" />
        Add New Alarm
      </Button>

      <Sheet open={isOpen} onOpenChange={modal.closeModal}>
        <SheetContent className="max-w-[540px]!">
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

            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={
                !selectedSiteId || isLoadingUsers || filteredUsers.length === 0
              }
            >
              <SelectTrigger label="Assigned User (Optional)">
                <SelectValue
                  placeholder={
                    !selectedSiteId
                      ? "Select a site first"
                      : isLoadingUsers
                      ? "Loading users..."
                      : filteredUsers.length === 0
                      ? "No users available for this site"
                      : "Select a user"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.length > 0 &&
                  filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                      {user.email && ` (${user.email})`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

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
          </form>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={modal.closeModal}>
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
