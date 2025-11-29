import type { IAdmin, MenuItem, PermissionType } from "@/types";

export function getAllAdminPermissions(roles?: IAdmin["roles"]) {
  if (!roles) return [];

  // Handle both single role and array of roles
  const rolesArray = Array.isArray(roles) ? roles : [roles];

  return rolesArray.flatMap((role) => role?.permissions || []);
}

export function getFirstRouteFromUser(
  menuItems: MenuItem[],
  userPermissions: PermissionType[]
) {
  // 1. Get the first "view" permission from the user
  const firstViewPermission = userPermissions.find((p) =>
    p.toLowerCase().endsWith("view")
  );

  if (!firstViewPermission) return null;

  // 2. Search the menu for the matching permission
  for (const section of menuItems) {
    for (const item of section.children) {
      if (item.permission === firstViewPermission) {
        return item.path; // 3. Return the matching route
      }
    }
  }

  return null;
}
