import { Button, OTPInput, Text } from "@/components";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ResendCode from "@/components/resend-code/ResendCode";

const schema = z.object({
  otp: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function OTPVerification() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 justify-center max-w-[580px] mx-auto w-full flex-1"
    >
      <div className="flex flex-col gap-1 text-center">
        <Text variant="h6">Enter the OTP sent to your email</Text>
        <Text variant="p" className="text-gray">
          Enter the 6 digit code sent to admin@microcbm.com
        </Text>
      </div>
      <div className="flex flex-col gap-6">
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
            onResend={() => {}}
            isLoading={false}
          />
        </section>
        <Button loading={false} disabled={false}>
          Verify OTP
        </Button>
      </div>
    </form>
  );
}
