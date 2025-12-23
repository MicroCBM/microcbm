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
  SheetTrigger,
  SheetFooter,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { addDepartmentService, getOrganizationsService } from "@/app/actions";
import { toast } from "sonner";
import { Icon } from "@/libs";
import Input from "@/components/input/Input";
import { ADD_DEPARTMENT_SCHEMA, AddDepartmentPayload } from "@/schema";
import { Organization } from "@/types";

type FormData = z.infer<typeof ADD_DEPARTMENT_SCHEMA>;

export const AddDepartmentModal = () => {
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] =
    React.useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_DEPARTMENT_SCHEMA),
    mode: "onSubmit",
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

    if (isAddDepartmentModalOpen) {
      fetchOrganizations();
    }
  }, [isAddDepartmentModalOpen]);

  const onSubmit = async (data: AddDepartmentPayload) => {
    try {
      const response = await addDepartmentService(data);
      if (response.success) {
        toast.success("Department created successfully", {
          description: "The department has been added to your list.",
        });
        reset();
        setIsAddDepartmentModalOpen(false);
      } else {
        toast.error(
          response.message || "Failed to create department. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to create department. Please try again."
      );
    }
  };

  return (
    <>
      <Sheet
        open={isAddDepartmentModalOpen}
        onOpenChange={setIsAddDepartmentModalOpen}
      >
        <SheetTrigger asChild>
          <Button
            permissions="organizations:create"
            onClick={() => setIsAddDepartmentModalOpen(true)}
            size="medium"
            className="rounded-full cursor-pointer"
          >
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Department
          </Button>
        </SheetTrigger>
        <SheetContent className="max-w-[540px]!">
          <SheetHeader>
            <SheetTitle>Add New Department</SheetTitle>
          </SheetHeader>

          <form
            id="add-department-form"
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
                      placeholder={
                        loading ? "Loading..." : "Select organization"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations?.map((organization) => (
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
              onClick={() => setIsAddDepartmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-department-form"
              loading={isSubmitting}
            >
              Create Department
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
