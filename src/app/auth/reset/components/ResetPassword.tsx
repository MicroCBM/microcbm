"use client";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils";
import { Icon } from "@/libs";
import { useRouter } from "next/navigation";
import { SPECIAL_CHARACTERS } from "@/helpers";
import { resetPasswordService } from "@/app/actions/auth";
import { toast } from "sonner";

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function ResetPassword({ email }: { email: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
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
    setErrorMessage("");

    const { password } = data;

    const response = await resetPasswordService({
      email,
      password,
    });

    if (response.success) {
      toast.success("Password reset successfully", {
        description: response.data?.message,
      });
      setTimeout(() => {
        router.push(ROUTES.AUTH.LOGIN);
      }, 1500);
    } else {
      setErrorMessage(
        response.message || "Failed to reset password. Please try again."
      );
      toast.error(
        response.message || "Failed to reset password. Please try again."
      );
    }
  };
  return (
    <div className="w-full p-10 flex flex-col justify-between min-h-screen">
      <div className="flex flex-col justify-center max-w-[580px] mx-auto w-full gap-10 flex-1">
        <div
          className="flex items-center gap-2 bg-gray-100 p-2 rounded-full cursor-pointer w-fit"
          onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        >
          <Icon icon="hugeicons:arrow-left-02" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <Text variant="h6">Change Password</Text>
            <Text variant="p" className="text-gray">
              Enter a new password for your account below
            </Text>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-4">
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
                  <p className="text-xs leading-[18px]">Minimum 8 characters</p>
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Enter your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message as string}
            />
          </div>

          <Button loading={isSubmitting} disabled={isSubmitting}>
            Save Password
          </Button>
        </form>
      </div>
    </div>
  );
}
