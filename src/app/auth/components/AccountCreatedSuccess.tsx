import React from "react";
import AccountSuccessLogo from "../../../../public/assets/svg/success.svg";
import { Button, Text } from "@/components";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils";

export default function AccountCreatedSuccess() {
  const router = useRouter();
  return (
    <section className="flex flex-col gap-6">
      <AccountSuccessLogo className="mx-auto w-24 h-24" />
      <div className="flex flex-col gap-1 text-center">
        <Text variant="h6">Account creation pending!</Text>
        <Text variant="p" className="text-gray">
          Your request has been forwarded to MicroCBM for account setup. Please
          hold on while the process is completed.
        </Text>
      </div>
      <Button onClick={() => router.push(ROUTES.AUTH.LOGIN)}>
        Return to login
      </Button>
    </section>
  );
}
