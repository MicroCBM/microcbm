import { z } from "zod";

export const ADD_ROLE_SCHEMA = z.object({
  name: z.string().min(1, "Role name is required"),
  level: z.number().min(1, "Level is required"),
  permissions: z.array(z.string()).optional(),
});

export const EDIT_ROLE_SCHEMA = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
  permissions: z.array(z.string()).optional(),
});

export type AddRolePayload = z.infer<typeof ADD_ROLE_SCHEMA>;
export type EditRolePayload = z.infer<typeof EDIT_ROLE_SCHEMA>;
