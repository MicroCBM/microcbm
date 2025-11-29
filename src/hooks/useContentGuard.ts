"use client";
import { useEffect, useState } from "react";

import type { PermissionType } from "@/types";
import type { SessionUser } from "@/types/common";
import { isTesting } from "@/utils/constants";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

export function useContentGuard(
  permission?: PermissionType | PermissionType[] | string | string[]
) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user session and permissions
    const fetchUserAndPermissions = async () => {
      try {
        // First, fetch user session to get role_id
        const sessionResponse = await fetch("/api/session");
        if (!sessionResponse.ok) {
          setUser(null);
          setUserPermissions([]);
          setIsLoading(false);
          return;
        }

        const sessionData = await sessionResponse.json();
        const userData = sessionData.user as SessionUser;

        if (!userData) {
          setUser(null);
          setUserPermissions([]);
          setIsLoading(false);
          return;
        }

        setUser(userData);

        // Use permissions from user session directly (they're already in the token)
        // These are the actual permissions the user has
        if (userData.permissions && Array.isArray(userData.permissions)) {
          setUserPermissions(userData.permissions);
        } else {
          // If permissions are not in session, try to fetch from role
          if (userData.role_id) {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
              const permissionsResponse = await fetch(
                `${apiUrl}/api/v1/roles/${userData.role_id}/permissions`,
                {
                  method: "GET",
                  credentials: "include", // Include cookies for authentication
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (permissionsResponse.ok) {
                const permissionsData = await permissionsResponse.json();
                console.log("permissionsResponse", permissionsData);

                const responseData = permissionsData?.data;

                // Handle different response formats
                let permissions: Permission[] = [];
                if (responseData && typeof responseData === "object") {
                  if (
                    "permissions" in responseData &&
                    Array.isArray(responseData.permissions)
                  ) {
                    permissions = responseData.permissions;
                  } else if (Array.isArray(responseData)) {
                    permissions = responseData;
                  }
                }

                // Extract permission strings (format: "resource:action")
                const permissionStrings = permissions.map(
                  (perm: Permission) => {
                    // Use name if it exists and follows the format, otherwise construct from resource:action
                    if (perm.name && perm.name.includes(":")) {
                      return perm.name;
                    }
                    return `${perm.resource}:${perm.action}`;
                  }
                );

                setUserPermissions(permissionStrings);
              } else {
                setUserPermissions([]);
              }
            } catch (error) {
              console.error("Error fetching role permissions:", error);
              setUserPermissions([]);
            }
          } else {
            setUserPermissions([]);
          }
        }
      } catch (error) {
        console.error("Error fetching user session or permissions:", error);
        setUser(null);
        setUserPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPermissions();
  }, []);

  if (isTesting) {
    return { isAllowed: true, isLoading: false, userPermissions: [] };
  }

  // Wait for data to load before making authorization decisions
  if (isLoading) {
    return { isAllowed: false, isLoading: true, userPermissions: [] };
  }

  // Check if user is SuperAdmin
  const isSuperAdmin = user?.role === "SuperAdmin";

  // If no permission check required, allow access
  if (!permission) {
    return { isAllowed: true, isLoading: false, userPermissions };
  }

  // Convert permission(s) to array format for easier checking
  const permissionsToCheck = Array.isArray(permission)
    ? permission
    : [permission];

  // Check if user has any of the required permissions
  const hasPermission = permissionsToCheck.some((perm) =>
    userPermissions.includes(perm)
  );

  // User is allowed if they have the permission OR if they're SuperAdmin
  const isAllowed = hasPermission || isSuperAdmin;

  return { isAllowed, isLoading: false, userPermissions };
}
