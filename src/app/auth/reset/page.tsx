"use client";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils";
import OTPVerification from "../components/OTPVerification";
import { Icon } from "@/libs";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const [step, setStep] = React.useState<"reset-password" | "otp">(
    "reset-password"
  );
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    setStep("otp");
  };
  return (
    <div className="w-full p-10 flex flex-col justify-between min-h-screen">
      {step === "reset-password" && (
        <div className="flex flex-col justify-center max-w-[580px] mx-auto w-full gap-10 flex-1">
          <Icon icon="hugeicons:arrow-left-02" className="size-6" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1 text-center">
              <Text variant="h6">Reset Password</Text>
              <Text variant="p" className="text-gray">
                Enter your registered email to reset your password
              </Text>
            </div>
            <section className="flex flex-col gap-6">
              <Input
                label="Email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message as string}
              />

              <Button loading={isSubmitting} disabled={isSubmitting}>
                Get OTP
              </Button>
            </section>
          </form>
        </div>
      )}
      {step === "otp" && <OTPVerification />}
      <div className="flex gap-2 text-sm text-blue">
        <Link href={ROUTES.HELP}>Help</Link>
        <span className="text-gray">|</span>
        <Link href={ROUTES.PRIVACY}>Privacy</Link>
        <span className="text-gray">|</span>
        <Link href={ROUTES.TERMS}>Terms</Link>
      </div>
    </div>
  );
}
