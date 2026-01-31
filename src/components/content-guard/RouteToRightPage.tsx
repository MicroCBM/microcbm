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
  const normalizedUserPerms = userPermissions.map((p) => p.toLowerCase());
  for (const section of menuItemsData) {
    for (const item of section.children) {
      if (!item.permission) continue;
      if (
        normalizedUserPerms.includes(item.permission.toLowerCase())
      ) {
        return item.path;
      }
    }
  }
  return null;
}

// Get the permission required for a path (exact match, then longest prefix for nested routes)
function getPermissionForPath(
  pathname: string,
  menuItemsData: typeof menuItems
): PermissionType | null {
  const entries: { path: string; permission: PermissionType }[] = [];
  for (const section of menuItemsData) {
    for (const item of section.children) {
      if (item.permission) {
        entries.push({ path: item.path, permission: item.permission });
      }
    }
  }
  entries.sort((a, b) => b.path.length - a.path.length);
  for (const { path, permission } of entries) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return permission;
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
    if (!isLoading && !isAllowed && !hasRedirected) {
      const accessibleRoute = getFirstAccessibleRoute(
        menuItems,
        userPermissions ?? []
      );
      const target =
        accessibleRoute && accessibleRoute !== pathname
          ? accessibleRoute
          : "/";

      if (target !== pathname) {
        setHasRedirected(true);
        router.replace(target);
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

type RouteGuardProps = {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
};

/**
 * Wraps (home) content and redirects to the first allowed page when the user
 * does not have permission for the current path. Permission is derived from
 * the current pathname using the menu config.
 */
export function RouteGuard({
  children,
  loadingFallback = null,
}: Readonly<RouteGuardProps>) {
  const pathname = usePathname();
  const permission = getPermissionForPath(pathname, menuItems);

  if (permission == null) {
    return <>{children}</>;
  }

  return (
    <RouteToRightPage permissions={permission} loadingFallback={loadingFallback}>
      {children}
    </RouteToRightPage>
  );
}
