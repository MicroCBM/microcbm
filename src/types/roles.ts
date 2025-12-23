import {
  PERMISSION_MODULES,
  PERMISSION_KEYS,
} from "../utils/constants/rolesAndPermissions";

export type PermissionType =
  `${(typeof PERMISSION_MODULES)[number]}:${(typeof PERMISSION_KEYS)[number]}`;
