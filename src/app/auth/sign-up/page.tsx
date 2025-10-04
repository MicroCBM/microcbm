"use client";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  LogoUpload,
} from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils";
import { Icon } from "@/libs";
import { INDUSTRIES, SPECIAL_CHARACTERS, TEAM_SIZES } from "@/helpers";
import AccountCreatedSuccess from "../components/AccountCreatedSuccess";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  organizationName: z
    .string()
    .min(1, { message: "Organization name is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  teamSize: z.string().min(1, { message: "Team size is required" }),
  logo: z
    .any()
    .refine((files) => files && files.length > 0, "Logo is required")
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (files) => files[0]?.type.startsWith("image/"),
      "Please select a valid image file"
    ),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const [step, setStep] = React.useState<
    "sign-up" | "organization-setup" | "logo-upload" | "account-created-success"
  >("account-created-success");
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const password = watch("password") || "";

  // Password validation functions
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()]/.test(password);

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);

    if (step === "sign-up") {
      setStep("organization-setup");
    } else if (step === "organization-setup") {
      setStep("logo-upload");
    } else if (step === "logo-upload") {
      // Handle final form submission
      console.log("Complete signup data:", data);
      // Here you would typically send the data to your API
      // For now, just log it
    } else if (step === "account-created-success") {
      setStep("sign-up");
    }
  };
  return (
    <div className="w-full p-10 flex flex-col justify-between min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center max-w-[580px] mx-auto w-full gap-10 flex-1"
      >
        {step === "sign-up" && (
          <div className="flex flex-col gap-6">
            <p className="text-gray text-lg text-center">1/3</p>

            <div className="flex flex-col gap-1 text-center">
              <Text variant="h6">Customize your organization</Text>
              <Text variant="p" className="text-gray">
                Setup your organization for members that may join later.
              </Text>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message as string}
              />
              <div className="flex flex-col gap-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  error={errors.password?.message as string}
                />
                <section className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasMinLength
                          ? "bg-blue text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {hasMinLength ? "✓" : "✗"}
                    </div>
                    <p className="text-xs leading-[18px]">
                      Minimum 8 characters
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasNumber
                          ? "bg-blue text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {hasNumber ? "✓" : "✗"}
                    </div>
                    <p className="text-xs leading-[18px]">One number</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasUppercase
                          ? "bg-blue text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {hasUppercase ? "✓" : "✗"}
                    </div>
                    <p className="text-xs leading-[18px]">
                      One Uppercase character
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasSpecialChar
                          ? "bg-blue text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {hasSpecialChar ? "✓" : "✗"}
                    </div>
                    <p className="text-xs leading-[18px]">
                      One special character {`(${SPECIAL_CHARACTERS})`}
                    </p>
                  </div>
                </section>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Next
              </Button>
              <p className="text-sm text-gray flex justify-end">
                Already have an account?{" "}
                <Link href={ROUTES.AUTH.LOGIN} className="text-blue">
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}
        {step === "organization-setup" && (
          <div className="flex flex-col gap-6">
            <p className="text-gray text-lg text-center">2/3</p>

            <div className="flex flex-col gap-1 text-center">
              <Text variant="h6">Customize your organization</Text>
              <Text variant="p" className="text-gray">
                Setup your organization for members that may join later.
              </Text>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Company Name"
                placeholder="Enter your organization name"
                {...register("organizationName")}
                error={errors.organizationName?.message as string}
              />

              <div className="flex flex-col gap-[6px]">
                <label className="text-sm">Industry</label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger error={errors.industry?.message}>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-sm">Team Size</label>
                <Controller
                  name="teamSize"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger error={errors.teamSize?.message}>
                        <SelectValue placeholder="Select a team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAM_SIZES.map((teamSize) => (
                          <SelectItem key={teamSize} value={teamSize}>
                            {teamSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.teamSize && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.teamSize.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Continue
            </Button>
          </div>
        )}
        {step === "logo-upload" && (
          <div className="flex flex-col gap-6">
            <p className="text-gray text-lg text-center">3/3</p>

            <div className="flex flex-col gap-1 text-center">
              <Text variant="h6">Upload your organization logo</Text>
              <Text variant="p" className="text-gray">
                This will be used as your organization logo.
              </Text>
            </div>

            <div className="flex flex-col gap-4">
              <LogoUpload
                name="logo"
                control={control}
                label="Organization Logo"
                maxSize={5}
                maxFiles={1}
                error={errors.logo?.message as string}
              />

              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline">
                  <Icon icon="mdi:camera" className="w-4 h-4" />
                  Take a photo
                </Button>
                <Button type="button" variant="outline">
                  <Icon icon="mdi:upload" className="w-4 h-4" />
                  Upload from library
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Complete Setup
            </Button>
          </div>
        )}
        {step === "account-created-success" && <AccountCreatedSuccess />}
      </form>
    </div>
  );
}
