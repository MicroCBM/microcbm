"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ComponentGuard } from "@/components/content-guard";
import { ROUTES } from "@/utils/route-constants";

export function RcaCreateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ComponentGuard
      permissions="rcas:create"
      unauthorizedFallback={
        <div className="p-4">
          <p className="text-gray-600">You do not have permission to create an RCA.</p>
          <button
            type="button"
            onClick={() => router.replace(ROUTES.RCA)}
            className="mt-2 text-blue-600 hover:underline"
          >
            Back to RCAs
          </button>
        </div>
      }
    >
      {children}
    </ComponentGuard>
  );
}
