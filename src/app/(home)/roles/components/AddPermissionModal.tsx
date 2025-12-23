"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { Icon } from "@/libs";
import {
  AddPermissionPayload,
  ADD_PERMISSION_SCHEMA,
} from "@/schema/permissions";
import { addPermissionService } from "@/app/actions";
import Input from "@/components/input/Input";
import { useRouter } from "next/navigation";

const ACTION_OPTIONS = [
  { value: "create", label: "Create" },
  { value: "view", label: "View" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "list", label: "List" },
];

export function AddPermissionModal({
  onPermissionCreated,
}: {
  onPermissionCreated?: () => void;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<AddPermissionPayload>({
    resolver: zodResolver(ADD_PERMISSION_SCHEMA),
  });

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: AddPermissionPayload) => {
    console.log("data in add permission modal", data);
    setIsSubmitting(true);
    try {
      const response = await addPermissionService(data);

      if (response.success) {
        toast.success("Permission created successfully", {
          description: "The permission has been added to your system.",
        });
        closeModal();
        onPermissionCreated?.();
        router.refresh();
      } else {
        toast.error(
          response.message || "Failed to create permission. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to create permission. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            permissions="permissions:create"
            size="medium"
            className="rounded-full cursor-pointer"
          >
            <Icon icon="mdi:plus-circle" className="size-5 text-white" />
            Create Permission
          </Button>
        </SheetTrigger>

        <SheetContent className="!max-w-[704px]">
          <SheetHeader>
            <SheetTitle>Create New Permission</SheetTitle>
          </SheetHeader>

          <form
            id="add-permission-form"
            onSubmit={handleSubmit(onSubmit)}
            className="px-6"
          >
            <div className="flex flex-col gap-6">
              <Input
                label="Permission Name"
                placeholder="Enter permission name"
                {...register("name")}
                error={errors.name?.message}
              />

              <Input
                label="Resource"
                placeholder="e.g., users"
                {...register("resource")}
                error={errors.resource?.message}
              />

              <Controller
                control={control}
                name="action"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger label="Action">
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.action?.message ? (
                <span className="text-xs text-red-500">
                  {errors.action.message}
                </span>
              ) : null}
            </div>
          </form>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="px-6"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-permission-form"
              disabled={isSubmitting}
              className="px-6"
              loading={isSubmitting}
            >
              Create Permission
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
