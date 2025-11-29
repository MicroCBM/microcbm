import { PERMISSION_KEYS, PERMISSION_MODULES } from "@/schema";

// Permission format matches token: "resource:action" (e.g., "alarms:create")
export type PermissionType =
  `${(typeof PERMISSION_MODULES)[number]}:${(typeof PERMISSION_KEYS)[number]}`;
