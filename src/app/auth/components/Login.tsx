"use client";
import { Button } from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils";
import OTPVerification from "./OTPVerification";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [step, setStep] = React.useState<"login" | "otp">("login");
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
      {step === "login" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center max-w-[580px] mx-auto w-full gap-2 flex-1"
        >
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message as string}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Password"
                {...register("password")}
                error={errors.password?.message as string}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button loading={isSubmitting} disabled={isSubmitting}>
                Login
              </Button>

              <p className="text-sm text-gray flex justify-end">
                Forgot password?{" "}
                <Link href={ROUTES.AUTH.RESET_PASSWORD} className="text-blue">
                  Reset password
                </Link>
              </p>
            </div>
          </section>
        </form>
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
