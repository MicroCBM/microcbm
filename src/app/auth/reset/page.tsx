"use client";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils";
import { Icon } from "@/libs";
import { useRouter } from "next/navigation";
import { requestPasswordResetService } from "@/app/actions/auth";
import { toast } from "sonner";
import OTPResetVerification from "./components/OTPResetVerification";
import ResetPassword from "./components/ResetPassword";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordRequest() {
  const [step, setStep] = React.useState<"reset-password" | "otp" | "reset">(
    "reset-password"
  );
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    const { email } = data;
    setErrorMessage("");

    const response = await requestPasswordResetService(email);

    if (response.success) {
      toast.success("OTP sent", { description: `${response.data?.message}` });
      setUserEmail(email);
      setStep("otp");
    } else {
      setErrorMessage(
        response.message || "Failed to send OTP. Please try again."
      );
    }
  };
  return (
    <div className="w-full p-10 flex flex-col justify-between min-h-screen">
      {step === "reset-password" && (
        <div className="flex flex-col justify-center max-w-[580px] mx-auto w-full gap-10 flex-1">
          <div
            className="flex items-center gap-2 bg-gray-100 p-2 rounded-full cursor-pointer w-fit"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            <Icon icon="hugeicons:arrow-left-02" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1 text-center">
              <Text variant="h6">Reset Password</Text>
              <Text variant="p" className="text-gray">
                Enter your registered email to reset your password
              </Text>
            </div>
            <section className="flex flex-col gap-6">
              {errorMessage && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                  {errorMessage}
                </div>
              )}

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
      {step === "otp" && (
        <OTPResetVerification email={userEmail} setStep={setStep} />
      )}
      {step === "reset" && <ResetPassword email={userEmail} />}
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
