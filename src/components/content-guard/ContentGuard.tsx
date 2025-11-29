"use client";
import type React from "react";

import type { PermissionType } from "@/types/roles";
import { useContentGuard } from "@/hooks";

type Props = {
  permissions?: PermissionType | PermissionType[] | string | string[];
  loadingFallback?: React.ReactNode;
  unauthorizedFallback?: React.ReactNode;
};

export function PageGuard({
  children,
  permissions,
  loadingFallback = null,
}: Readonly<React.PropsWithChildren<Props>>) {
  const { isAllowed, isLoading } = useContentGuard(permissions);

  if (isLoading) return <>{loadingFallback}</>;

  if (!isAllowed)
    throw new Error(
      "Unauthorized. You do not have the permission to access this resource."
    );

  return <>{children}</>;
}

export function ComponentGuard({
  children,
  permissions,
  loadingFallback = null, // Default loading state
  unauthorizedFallback = null, // Optional unauthorized message
}: Readonly<React.PropsWithChildren<Props>>) {
  const { isAllowed, isLoading } = useContentGuard(permissions);

  if (isLoading) return <>{loadingFallback}</>;

  if (!isAllowed) return <>{unauthorizedFallback}</>;

  return <>{children}</>;
}
