"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Text,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui";
import { Icon } from "@/libs";
import { EditRolePayload, EDIT_ROLE_SCHEMA } from "@/schema";
import { editRoleService } from "@/app/actions";
import Input from "@/components/input/Input";
import { useRouter } from "next/navigation";

const ACTIVE_STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  description: string;
  created_at: number;
  created_at_datetime: string;
  active?: boolean;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

interface EditRoleModalProps {
  role: Role | null;
  isOpen: boolean;
  onClose: () => void;
  onRoleUpdated?: () => void;
}

export function EditRoleModal({
  role,
  isOpen,
  onClose,
  onRoleUpdated,
}: EditRoleModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditRolePayload>({
    resolver: zodResolver(EDIT_ROLE_SCHEMA),
  });

  useEffect(() => {
    if (isOpen && role) {
      reset({
        name: role.name,
        description: role.description || "",
        active: role.active || false,
      });
    }
  }, [isOpen, role, reset]);

  console.log("errors", errors);

  const onSubmit = async (data: EditRolePayload) => {
    console.log("data", data);
    if (!role) return;

    setIsSubmitting(true);
    try {
      const response = await editRoleService(role.id, data);
      if (response.success) {
        toast.success("Role updated successfully", {
          description: "The role has been updated in your system.",
        });
        onRoleUpdated?.();
        router.refresh();
        handleClose();
      } else {
        toast.error(
          response.message || "Failed to update role. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!role) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="!max-w-[704px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Role</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit as SubmitHandler<EditRolePayload>)}
          className="px-6"
        >
          <div className="flex flex-col gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <Text variant="h6">Basic Information</Text>

              <Input
                label="Role Name"
                placeholder="e.g., Operations Manager"
                {...register("name")}
                error={errors.name?.message}
              />

              <Text variant="h6">Description</Text>
              <Input
                type="textarea"
                rows={4}
                {...register("description")}
                placeholder="Describe the role's responsibilities and scope..."
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
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white flex justify-end gap-4 py-4 border-t border-gray-200 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-6">
              {isSubmitting ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
