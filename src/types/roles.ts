import { PERMISSION_KEYS, PERMISSION_MODULES } from "@/schema";

export type PermissionType =
  `${(typeof PERMISSION_MODULES)[number]}:${(typeof PERMISSION_KEYS)[number]}`;
