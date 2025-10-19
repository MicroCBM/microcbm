"use client";
import { editUserService } from "@/app/actions";
import {
  Button,
  Label,
  PhoneInput,
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
import CountrySelect from "@/components/country-select/CountrySelect";
import Input from "@/components/input/Input";
import { EDIT_USER_SCHEMA } from "@/schema";
import { EditUserPayload, Organization, Role, Sites, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as RPNInput from "react-phone-number-input";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import dayjs from "dayjs";

export const EditNewUser = ({
  sites,
  user,
  isOpen,
  onClose,
  rolesData,
  organizations,
}: {
  sites: Sites[];
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  rolesData: Role[];
  organizations: Organization[];
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    reset,
  } = useForm<EditUserPayload>({
    resolver: zodResolver(EDIT_USER_SCHEMA),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!user) return;
    reset({
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        country: user.country,
        date_of_birth: dayjs(user.date_of_birth).format("YYYY-MM-DD"),
        role_id: user.role_id || "",
        organization: {
          id: user.organization.id,
        },
        site: {
          id: user.site?.id,
        },
      },
      password: user.password_hash,
    });
  }, [user, reset]);

  const onSubmit = async (data: EditUserPayload) => {
    const roleId = rolesData.find((role) => role.name === data.user.role)?.id;

    const payload = {
      ...data,
      user: {
        ...data.user,
        role_id: roleId as string,
      },
    };

    try {
      const result = await editUserService(user?.id as string, payload);
      if (result.success) {
        toast.success("User updated successfully!");
        onClose();
      } else {
        toast.error(result.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user");
    }
  };

  if (!user) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="!max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
          </SheetHeader>
          <form
            id="add-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 grid grid-cols-2 gap-4 overflow-y-auto max-h-[80vh]"
          >
            <Input
              label="First Name"
              placeholder="First Name"
              {...register("user.first_name")}
              error={errors.user?.first_name}
            />
            <Input
              label="Last Name"
              placeholder="Last Name"
              {...register("user.last_name")}
              error={errors.user?.last_name}
            />

            <Input
              label="Email"
              className="col-span-full"
              placeholder="Email"
              {...register("user.email")}
              error={errors.user?.email}
            />

            <Controller
              control={control}
              name="user.country"
              render={({ field }) => (
                <CountrySelect
                  className="col-span-full w-full"
                  label="Country"
                  placeholder="Country"
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Input
              label="Date of Birth"
              type="date"
              placeholder="Date of Birth"
              {...register("user.date_of_birth")}
              error={errors.user?.date_of_birth}
            />

            <div className="flex flex-col gap-[6px] col-span-full">
              <Label className="font-normal">Phone</Label>
              <Controller
                control={control}
                name="user.phone"
                render={({ field }) => (
                  <PhoneInput
                    defaultCountry="GH"
                    placeholder="(123) 456-7890"
                    value={field.value as RPNInput.Value}
                    onChange={field.onChange}
                    error={errors.user?.phone?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="user.site.id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-full" label="Site">
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

            <Controller
              name="user.role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-full" label="Role">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesData.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="user.organization.id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-full" label="Organization">
                    <SelectValue placeholder="Select an organization" />
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

            <Controller
              name="user.status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-full" label="Status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </form>
          <SheetFooter>
            <Button type="button" variant="outline">
              Discard
            </Button>
            <Button type="submit" form="add-user-form" loading={isSubmitting}>
              Update User
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
