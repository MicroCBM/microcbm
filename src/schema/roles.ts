import { z } from "zod";

export const ADD_ROLE_SCHEMA = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  active: z.boolean(),
});

export const EDIT_ROLE_SCHEMA = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  active: z.boolean(),
});

export const ADD_PERMISSIONS_TO_ROLE_SCHEMA = z.object({
  permission_ids: z.array(z.string()).min(1, "Permission IDs are required"),
});

export type AddRolePayload = z.infer<typeof ADD_ROLE_SCHEMA>;
export type EditRolePayload = z.infer<typeof EDIT_ROLE_SCHEMA>;
export type AddPermissionsToRolePayload = z.infer<
  typeof ADD_PERMISSIONS_TO_ROLE_SCHEMA
>;

export const PERMISSION_MODULES = [
  "dashboard",
  "alarms",
  "assets",
  "organizations",
  "recommendations",
  "reports",
  "samples",
  "sampling_points",
  "sites",
  "users",
] as const;

export const PERMISSION_KEYS = [
  "create",
  "read",
  "update",
  "delete",
  "list",
] as const;

export const ALL_ROLES_AND_PERMISSIONS = PERMISSION_MODULES.map((module) => ({
  module,
  ...{
    view: "view",
    create: "create",
    edit: "edit",
    delete: "delete",
    export: "export",
    "approve/reject": "approve/reject",
    "deactivate/activate": "deactivate/activate",
  },
}));
