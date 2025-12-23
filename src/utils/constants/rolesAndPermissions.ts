export const PERMISSION_MODULES = [
  "dashboard",
  "alarms",
  "assets",
  "organizations",
  "recommendations",
  "reports",
  "samples",
  "sampling_points",
  "sampling_routes",
  "sites",
  "users",
  "roles",
  "permissions",
] as const;

export const PERMISSION_KEYS = [
  "create",
  "read",
  "update",
  "delete",
  "list",
] as const;

export const DISABLE_PERMISSION_MODULES = [
  "dashboard:create",
  "dashboard:delete",
];

export const ALL_ROLES_AND_PERMISSIONS = PERMISSION_MODULES.map((module) => ({
  module,
  create: "create",
  read: "read",
  update: "update",
  delete: "delete",
  list: "list",
}));
