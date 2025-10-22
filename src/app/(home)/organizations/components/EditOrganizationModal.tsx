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
import { EDIT_ORGANIZATION_SCHEMA, EditOrganizationPayload } from "@/schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Organization } from "@/types";
import { editOrganizationService } from "@/app/actions";
import { toast } from "sonner";
import Input from "@/components/input/Input";
import { INDUSTRIES } from "@/helpers";

type FormData = z.infer<typeof EDIT_ORGANIZATION_SCHEMA>;

export const EditOrganizationModal = ({
  organization,
  organizationId,
  isEditModalOpen,
  setIsEditModalOpen,
}: {
  organization: Organization;
  organizationId: string;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(EDIT_ORGANIZATION_SCHEMA),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (organization) {
      reset({
        name: organization?.name || "",
        industry: organization?.industry || "",
        team_strength: organization?.team_strength || "",
        description: organization?.description || "",
      });
    }
  }, [organization, reset]);

  const onSubmit = async (data: EditOrganizationPayload) => {
    try {
      const response = await editOrganizationService(organizationId, data);
      if (response.success) {
        toast.success("Organization updated successfully", {
          description: `${response.data?.message}`,
        });
        setIsEditModalOpen(false);
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Organization update failed. Please try again."
      );
    }
  };

  return (
    <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <SheetContent className="!max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Organization</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 p-6 flex flex-col gap-4">
            <Input
              label="Organization Name"
              placeholder="Enter organization name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry: string) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="team_strength"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Team Size">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Input
              type="textarea"
              rows={4}
              label="Description"
              placeholder="Describe the organization's description"
              {...register("description")}
              error={errors.description?.message}
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
            <Button loading={isSubmitting}>Update Organization</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
