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
import { AddRolePayload, ADD_ROLE_SCHEMA } from "@/schema";
import { addRoleService } from "@/app/actions";
import Input from "@/components/input/Input";
import { useRouter } from "next/navigation";

const ACTIVE_STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

export function AddRoleModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AddRolePayload>({
    resolver: zodResolver(ADD_ROLE_SCHEMA),
  });

  const onSubmit = async (data: AddRolePayload) => {
    setIsSubmitting(true);
    try {
      const response = await addRoleService(data);

      if (response.success) {
        toast.success("Role created successfully", {
          description: "The role has been added to your system.",
        });
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(
          response.message || "Failed to create role. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to create role. Please try again."
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
            permissions="roles:create"
            size="medium"
            className="rounded-full cursor-pointer"
          >
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Create Role
          </Button>
        </SheetTrigger>

        <SheetContent className="!max-w-[704px]">
          <SheetHeader>
            <SheetTitle>Create New Role</SheetTitle>
          </SheetHeader>

          <form
            id="add-role-form"
            onSubmit={handleSubmit(onSubmit)}
            className="px-6"
          >
            <div className="flex flex-col gap-6">
              <Input
                label="Role Name"
                placeholder="e.g., Operations Manager"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                type="textarea"
                rows={4}
                label="Description"
                placeholder="Describe the role's responsibilities and scope..."
                {...register("description")}
                error={errors.description?.message}
              />
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(value) => field.onChange(value === "true")}
                  >
                    <SelectTrigger label="Status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVE_STATUS_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value ? "true" : "false"}
                          value={option.value ? "true" : "false"}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Form Actions */}
          </form>
          <SheetFooter>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-role-form"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
