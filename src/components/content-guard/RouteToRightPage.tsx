"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import type { PermissionType } from "@/types";
import { useContentGuard } from "@/hooks";
import menuItems from "@/utils/shared";

type Props = {
  permissions?: PermissionType | PermissionType[];
  loadingFallback?: React.ReactNode;
  unauthorizedFallback?: React.ReactNode;
};

// Helper function to find the first route the user has permission to access
function getFirstAccessibleRoute(
  menuItemsData: typeof menuItems,
  userPermissions: string[]
): string | null {
  // Iterate through all menu items to find the first one the user can access
  for (const section of menuItemsData) {
    for (const item of section.children) {
      if (!item.permission) continue;

      // Check if user has the required permission
      if (userPermissions.includes(item.permission)) {
        return item.path;
      }
    }
  }

  return null;
}

export function RouteToRightPage({
  children,
  permissions,
  loadingFallback = null,
  unauthorizedFallback = null,
}: Readonly<React.PropsWithChildren<Props>>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAllowed, isLoading, userPermissions } =
    useContentGuard(permissions);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if user doesn't have permission and hasn't redirected yet
    if (!isLoading && !isAllowed && userPermissions && !hasRedirected) {
      const accessibleRoute = getFirstAccessibleRoute(
        menuItems,
        userPermissions
      );

      if (accessibleRoute && accessibleRoute !== pathname) {
        setHasRedirected(true);
        router.replace(accessibleRoute);
      }
    }
  }, [isLoading, isAllowed, userPermissions, router, pathname, hasRedirected]);

  if (isLoading) return <>{loadingFallback}</>;

  // If user doesn't have permission, show loading while redirecting
  if (!isAllowed) {
    // Show unauthorized fallback briefly while redirect happens
    if (hasRedirected) {
      return <>{loadingFallback || <div>Redirecting...</div>}</>;
    }
    return <>{unauthorizedFallback}</>;
  }

  return <>{children}</>;
}
