"use client";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  // LogoUpload,
} from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ROUTES } from "@/utils";
import { Icon } from "@/libs";
import { INDUSTRIES, SPECIAL_CHARACTERS, TEAM_SIZES } from "@/helpers";
import AccountCreatedSuccess from "../components/AccountCreatedSuccess";
import { signupService } from "@/app/actions/auth";

// Step-based validation schemas
const step1Schema = z.object({
  user: z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const step2Schema = z.object({
  organization: z.object({
    name: z.string().min(1, { message: "Organization name is required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    team_strength: z.string().min(1, { message: "Team strength is required" }),
  }),
});

const step3Schema = z.object({
  organization: z.object({
    logo_url: z.string().min(1, { message: "Logo URL is required" }),
  }),
});

// Full schema for TypeScript types
const fullSchema = z.object({
  user: z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  }),
  organization: z.object({
    name: z.string().min(1, { message: "Organization name is required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    team_strength: z.string().min(1, { message: "Team strength is required" }),
    logo_url: z.string().min(1, { message: "Logo URL is required" }),
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormData = z.infer<typeof fullSchema>;

export default function SignUp() {
  const [step, setStep] = React.useState<
    "sign-up" | "organization-setup" | "logo-upload" | "account-created-success"
  >("sign-up");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    control,
  } = useForm<FormData>({
    mode: "onChange",
  });

  console.log("Errors:", errors);

  const password = watch("password") || "";

  // Password validation functions
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()]/.test(password);

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    setErrorMessage(""); // Clear previous errors

    if (step === "sign-up") {
      // Validate step 1 fields
      const step1Data = {
        user: {
          first_name: data.user?.first_name,
          last_name: data.user?.last_name,
          email: data.user?.email,
        },
        password: data.password,
      };

      const result = step1Schema.safeParse(step1Data);
      if (result.success) {
        setStep("organization-setup");
      } else {
        console.error("Step 1 validation failed:", result.error);
        setErrorMessage("Please fill in all required fields correctly.");
      }
    } else if (step === "organization-setup") {
      // Validate step 2 fields
      const step2Data = {
        organization: {
          name: data.organization?.name,
          industry: data.organization?.industry,
          team_strength: data.organization?.team_strength,
        },
      };

      const result = step2Schema.safeParse(step2Data);
      if (result.success) {
        setStep("logo-upload");
      } else {
        console.error("Step 2 validation failed:", result.error);
        setErrorMessage("Please fill in all required fields correctly.");
      }
    } else if (step === "logo-upload") {
      // Validate step 3 fields
      const step3Data = {
        organization: {
          logo_url: data.organization?.logo_url,
        },
      };

      const result = step3Schema.safeParse(step3Data);
      if (!result.success) {
        console.error("Step 3 validation failed:", result.error);
        setErrorMessage("Please upload an organization logo.");
        return;
      }

      // Validate full form before submitting
      const fullResult = fullSchema.safeParse(data);
      if (!fullResult.success) {
        console.error("Full validation failed:", fullResult.error);
        setErrorMessage("Please complete all steps correctly.");
        return;
      }

      // Handle final form submission
      console.log("Complete signup data:", data);

      const response = await signupService(data);

      if (response.success) {
        setStep("account-created-success");
      } else {
        // Show error message to user
        setErrorMessage(response.message || "Signup failed. Please try again.");
        console.error("Signup failed:", response);
      }
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
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  {...register("user.first_name")}
                  error={errors.user?.first_name?.message as string}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  {...register("user.last_name")}
                  error={errors.user?.last_name?.message as string}
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("user.email")}
                error={errors.user?.email?.message as string}
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
              {errorMessage && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                  {errorMessage}
                </div>
              )}

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
                {...register("organization.name")}
                error={errors.organization?.name?.message as string}
              />

              <div className="flex flex-col gap-[6px]">
                <label className="text-sm">Industry</label>
                <Controller
                  name="organization.industry"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        error={errors.organization?.industry?.message}
                      >
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
                {errors.organization?.industry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.organization?.industry.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-sm">Team Size</label>
                <Controller
                  name="organization.team_strength"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        error={errors.organization?.team_strength?.message}
                      >
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
                {errors.organization?.team_strength && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.organization?.team_strength.message}
                  </p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                {errorMessage}
              </div>
            )}

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
              <Input
                label="Organization Logo"
                type="text"
                // type="file"
                placeholder="Enter your email"
                {...register("organization.logo_url")}
                error={errors.organization?.logo_url?.message as string}
              />
              {/* <LogoUpload
                name="organization.logo_url"
                control={control}
                label="Organization Logo"
                maxSize={5}
                maxFiles={1}
                error={errors.organization?.logo_url?.message as string}
              /> */}

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

            {errorMessage && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                {errorMessage}
              </div>
            )}

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
