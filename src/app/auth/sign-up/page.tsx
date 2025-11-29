"use client";
import {
  Button,
  ImageUpload,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ROUTES } from "@/utils";
import { INDUSTRIES, SPECIAL_CHARACTERS, TEAM_SIZES } from "@/helpers";
import AccountCreatedSuccess from "../components/AccountCreatedSuccess";
import { signupService } from "@/app/actions/auth";
import {
  SIGN_UP_FULL_SCHEMA,
  SIGN_UP_STEP_1_SCHEMA,
  SIGN_UP_STEP_2_SCHEMA,
} from "@/schema";
import { uploadImage } from "@/app/actions";
import { Icon } from "@/libs";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = React.useState<
    "sign-up" | "organization-setup" | "logo-upload" | "account-created-success"
  >("sign-up");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(
    null
  );

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    control,
  } = useForm<z.infer<typeof SIGN_UP_FULL_SCHEMA>>({
    mode: "onChange",
  });

  console.log("Errors:", errors);

  const password = watch("password") || "";

  // Password validation functions
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()]/.test(password);

  const onSubmit = async (data: z.infer<typeof SIGN_UP_FULL_SCHEMA>) => {
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

      const result = SIGN_UP_STEP_1_SCHEMA.safeParse(step1Data);
      if (result.success) {
        setStep("organization-setup");
      } else {
        console.error("Step 1 validation failed:", result.error);
        const firstError = result.error.issues[0];
        setErrorMessage(
          firstError?.message || "Please fill in all required fields correctly."
        );
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

      const result = SIGN_UP_STEP_2_SCHEMA.safeParse(step2Data);
      if (result.success) {
        setStep("logo-upload");
      } else {
        console.error("Step 2 validation failed:", result.error);
        const firstError = result.error.issues[0];
        setErrorMessage(
          firstError?.message || "Please fill in all required fields correctly."
        );
      }
    } else if (step === "logo-upload") {
      // Validate step 3 fields
      const result = SIGN_UP_FULL_SCHEMA.safeParse(data);
      if (!result.success) {
        console.error("Full validation failed:", result.error);
        setErrorMessage("Please complete all steps correctly.");
        return;
      }

      // Validate full form before submitting
      const fullResult = SIGN_UP_FULL_SCHEMA.safeParse(data);
      if (!fullResult.success) {
        console.error("Full validation failed:", fullResult.error);
        setErrorMessage("Please complete all steps correctly.");
        return;
      }

      // Handle final form submission
      console.log("Complete signup data:", data);

      const response = await signupService({
        user: data.user,
        organization: {
          ...data.organization,
          logo_url: data.organization?.logo_url || uploadedFileName || "",
        },
        password: data.password,
      });

      console.log("response", response);

      if (response.success) {
        setStep("account-created-success");
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        setErrorMessage(response.message || "Signup failed. Please try again.");
      }
    }
  };

  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);

    const response = await uploadImage(
      { file: file as File },
      "organization-logos"
    );
    // if (response.success) {
    setUploadedFileName(response.data?.data?.file_key as string);
    // } else {
    //   setErrorMessage(
    //     response.message || "Image upload failed. Please try again."
    //   );
    // }
  }
  return (
    <div className="w-full p-10 flex flex-col justify-between min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center max-w-[580px] mx-auto w-full gap-10 flex-1"
      >
        {step !== "sign-up" && (
          <button
            type="button"
            onClick={() =>
              setStep(step === "logo-upload" ? "organization-setup" : "sign-up")
            }
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit mb-2"
          >
            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
            Back
          </button>
        )}
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
                <Controller
                  name="organization.industry"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Industry"
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
                <Controller
                  name="organization.team_strength"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Team Size"
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
              <ImageUpload
                file={file}
                onFileChange={setFile}
                onUpload={handleImageUpload}
                isUploading={isUploadingImage}
                currentImageUrl={uploadedFileName || undefined}
              />
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
