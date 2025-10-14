"use client";
import { addUserService } from "@/app/actions";
import {
  Button,
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
  SheetTrigger,
} from "@/components";
import CountrySelect from "@/components/country-select/CountrySelect";
import Input from "@/components/input/Input";
import { Icon } from "@/libs";
import { ADD_USER_SCHEMA } from "@/schema";
import { AddUserPayload } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as RPNInput from "react-phone-number-input";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddNewUser = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
  } = useForm<AddUserPayload>({
    resolver: zodResolver(ADD_USER_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      user: {
        status: "active",
      },
    },
  });

  const onSubmit = async (data: AddUserPayload) => {
    console.log("submit data", data);
    const { user, password } = data;

    const response = await addUserService({
      user,
      password,
    });

    if (response.success) {
      toast.success("User added successfully", {
        description: `${response.data?.message}`,
      });
    } else {
      toast.error(
        response.message || "User addition failed. Please try again."
      );
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New User
          </Button>
        </SheetTrigger>
        <SheetContent className="!max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Add User</SheetTitle>
          </SheetHeader>
          <form
            id="add-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 grid grid-cols-2 gap-4"
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
              label="Date of Birth"
              type="date"
              placeholder="Date of Birth"
              {...register("user.date_of_birth")}
              error={errors.user?.date_of_birth}
            />

            <Controller
              control={control}
              name="user.country"
              render={({ field }) => (
                <CountrySelect
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
              label="Email"
              className="col-span-2"
              placeholder="Email"
              {...register("user.email")}
              error={errors.user?.email}
            />

            <Controller
              control={control}
              name="user.phone"
              render={({ field }) => (
                <PhoneInput
                  className="col-span-full"
                  defaultCountry="GH"
                  placeholder="(123) 456-7890"
                  value={field.value as RPNInput.Value}
                  onChange={field.onChange}
                  error={errors.user?.phone?.message}
                />
              )}
            />
            <Controller
              name="user.site.id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">Site 1</SelectItem>
                    <SelectItem value="Canada">Site 2</SelectItem>
                    <SelectItem value="UK">Site 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="user.role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="user.role_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Role ID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Role ID 1</SelectItem>
                    <SelectItem value="2">Role ID 2</SelectItem>
                    <SelectItem value="3">Role ID 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="user.organization.id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="org1">Organization 1</SelectItem>
                    <SelectItem value="org2">Organization 2</SelectItem>
                    <SelectItem value="org3">Organization 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="user.status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Input
              label="Password"
              type="password"
              className="col-span-2"
              {...register("password")}
              error={errors.password}
            />
          </form>
          <SheetFooter>
            <Button type="button" variant="outline">
              Discard
            </Button>
            <Button type="submit" form="add-user-form" loading={isSubmitting}>
              Request Approval
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
