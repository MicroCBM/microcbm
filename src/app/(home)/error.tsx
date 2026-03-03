"use client";

import { Button, Text } from "@/components";
import { useEffect } from "react";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Text variant="h6" className="font-semibold">
        Something went wrong
      </Text>
      <Text variant="p" className="text-sm text-gray-400 text-center max-w-md">
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </Text>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
