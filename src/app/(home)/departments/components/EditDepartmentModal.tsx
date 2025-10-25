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

import { editDepartmentService, getOrganizationsService } from "@/app/actions";
import { toast } from "sonner";
import Input from "@/components/input/Input";
import { EDIT_DEPARTMENT_SCHEMA, EditDepartmentPayload } from "@/schema";
import { Department, Organization } from "@/types";

type FormData = z.infer<typeof EDIT_DEPARTMENT_SCHEMA>;

interface EditDepartmentModalProps {
  department: Department | null;
  departmentId: string;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
}

export const EditDepartmentModal = ({
  department,
  departmentId,
  isEditModalOpen,
  setIsEditModalOpen,
}: EditDepartmentModalProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(EDIT_DEPARTMENT_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
      organization_id: department?.organization.id || "",
    },
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const orgs = await getOrganizationsService();
        setOrganizations(orgs);
      } catch {
        toast.error("Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    if (isEditModalOpen) {
      fetchOrganizations();
      // Reset form with current department data
      reset({
        name: department?.name || "",
        description: department?.description || "",
        organization_id: department?.organization.id || "",
      });
    }
  }, [isEditModalOpen, department, reset]);

  const onSubmit = async (data: EditDepartmentPayload) => {
    try {
      const response = await editDepartmentService(departmentId, data);
      if (response.success) {
        toast.success("Department updated successfully", {
          description: "The department has been updated.",
        });
        reset();
        setIsEditModalOpen(false);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(
          response.message || "Failed to update department. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to update department. Please try again."
      );
    }
  };

  return (
    <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <SheetContent className="!max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
        </SheetHeader>

        <form
          id="edit-department-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full px-6 overflow-y-auto gap-4"
        >
          <Input
            label="Department Name"
            placeholder="Enter department name"
            {...register("name")}
            error={errors.name?.message}
          />

          <Controller
            control={control}
            name="organization_id"
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={loading}
              >
                <SelectTrigger label="Organization">
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Select organization"}
                  />
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

          <Input
            type="textarea"
            rows={4}
            label="Description"
            placeholder="Describe the department's purpose and responsibilities"
            {...register("description")}
            error={errors.description?.message}
          />
        </form>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-department-form"
            loading={isSubmitting}
          >
            Update Department
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
