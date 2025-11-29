"use client";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils";
import OTPVerification from "./OTPVerification";
import { loginService } from "@/app/actions/auth";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [step, setStep] = React.useState<"login" | "otp">("login");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [userEmail, setUserEmail] = React.useState<string>("");
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
    setErrorMessage("");

    const response = await loginService({
      email,
      password,
    });

    if (response.success) {
      toast.success("OTP sent", { description: `${response.data?.message}` });
      setUserEmail(email);
      setStep("otp");
    } else {
      setErrorMessage(response.message || "Login failed. Please try again.");
    }
  };
  return (
    <div className="w-full p-10 flex flex-col justify-between min-h-screen">
      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
          {errorMessage}
        </div>
      )}

      {step === "login" && (
        <section className="flex flex-col gap-6 max-w-[580px] m-auto w-full">
          <div className="flex flex-col gap-1 text-center">
            <Text variant="h6">Welcome back!</Text>
            <Text variant="p" className="text-gray">
              Don&apos;t have an account?
              <Link href={ROUTES.AUTH.REGISTER} className="text-blue">
                {" "}
                Sign up
              </Link>
            </Text>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col  gap-2 flex-1"
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
                    {" "}
                    Reset password
                  </Link>
                </p>
              </div>
            </section>
          </form>
        </section>
      )}
      {step === "otp" && <OTPVerification email={userEmail} />}
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
