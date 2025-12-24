"use client";
import React from "react";
import { Organization, Sites } from "@/types";
import { MODALS } from "@/utils/constants/modals";
import { usePersistedModalState } from "@/hooks";
import {
  Button,
  PhoneInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui";
import Input from "@/components/input/Input";
import { Controller, useForm } from "react-hook-form";
import { ADD_USER_SCHEMA } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addUserService } from "@/app/actions";
import CountrySelect from "@/components/country-select/CountrySelect";
import * as RPNInput from "react-phone-number-input";
import { z } from "zod";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  created_at: number;
  created_at_datetime: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}
export function CreateCustomer({
  rolesData,
  organizations,
  sites,
}: {
  rolesData: Role[];
  organizations: Organization[];
  sites: Sites[];
}) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
  } = useForm<z.infer<typeof ADD_USER_SCHEMA>>({
    resolver: zodResolver(ADD_USER_SCHEMA),
    mode: "onSubmit",
    defaultValues: {
      user: {
        status: "active",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof ADD_USER_SCHEMA>) => {
    console.log("submit data", data);
    const { user, password } = data;
    const roleId = rolesData.find((role) => role.name === user.role)?.id;

    const organizationId = organizations.find(
      (organization) => organization.id === user.organization.id
    )?.id;
    const siteId = sites.find((site) => site.id === user.site.id)?.id;

    const payload = {
      password,
      user: {
        ...user,
        role_id: roleId as string,
        organization: {
          id: organizationId as string,
        },
        site: {
          id: siteId as string,
        },
      },
    };

    const response = await addUserService(payload);

    if (response.success) {
      toast.success("User added successfully", {
        description: `${response.data?.message}`,
      });
      modal.closeModal();
      router.refresh();
    } else {
      toast.error(
        response.message || "User addition failed. Please try again."
      );
    }
  };

  const modal = usePersistedModalState({
    paramName: MODALS.USER.CHILDREN.CREATE,
  });

  const isOpen = modal.isModalOpen(MODALS.USER.CHILDREN.CREATE);

  return (
    <>
      <div className="flex justify-end">
        <Button
          permissions="users:create"
          className="cursor-pointer"
          size={"medium"}
          onClick={() => modal.openModal(MODALS.USER.CHILDREN.CREATE)}
        >
          Create user
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={(open) => !open && modal.closeModal()}>
        <SheetContent className="max-w-[864px]! flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle>Create user</SheetTitle>
          </SheetHeader>

          <form
            id="add-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 grid grid-cols-2 gap-4 overflow-y-aut py-8"
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
              name="user.site.id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="col-span-full"
                    label="Site Assigned"
                  >
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
              name="user.status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="col-span-full" label="Status">
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
              className="col-span-full"
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password}
            />
          </form>

          <SheetFooter className="px-6 pb-6 pt-4">
            <Button
              onClick={modal.closeModal}
              className="px-10"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="px-20"
              type="submit"
              form="add-user-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Add User"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
