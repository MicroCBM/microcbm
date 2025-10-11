import { Button, OTPInput, Text } from "@/components";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ResendCode from "@/components/resend-code/ResendCode";
import { verifyPasswordResetOTPService } from "@/app/actions/auth";
import { toast } from "sonner";

const schema = z.object({
  otp: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

interface OTPResetVerificationProps {
  email: string;
  setStep: (step: "reset-password" | "otp" | "reset") => void;
}

export default function OTPResetVerification({
  setStep,
  email,
}: OTPResetVerificationProps) {
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await verifyPasswordResetOTPService(email, data.otp);

      if (response.success) {
        setStep("reset");
        toast.success("OTP verified", {
          description: `${response.data?.message}`,
        });
      } else {
        setErrorMessage(
          response.message || "OTP verification failed. Please try again."
        );
        toast.error(
          response.message || "OTP verification failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 justify-center max-w-[580px] mx-auto w-full flex-1"
    >
      <div className="flex flex-col gap-1 text-center">
        <Text variant="h6">Enter the OTP sent to your email</Text>
        <Text variant="p" className="text-gray">
          Enter the 6 digit code sent to {email}
        </Text>
      </div>
      <div className="flex flex-col gap-6">
        {errorMessage && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded text-center">
            {errorMessage}
          </div>
        )}
        <section className="flex flex-col gap-2 items-center">
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <OTPInput
                inputType="password"
                {...field}
                secure
                onChange={(value) => {
                  field.onChange(value);
                  if (value.length === 6) {
                    onSubmit({ otp: value });
                  }
                }}
              />
            )}
          />

          <ResendCode
            countdown={10}
            formatCountdown={() => {
              return "10";
            }}
            onResend={() => {
              // TODO: Implement resend OTP functionality
              console.log("Resend OTP clicked");
            }}
            isLoading={isLoading}
          />
        </section>
        <Button loading={isLoading} disabled={isLoading}>
          Verify OTP
        </Button>
      </div>
    </form>
  );
}
