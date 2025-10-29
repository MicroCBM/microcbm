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

export type AddRolePayload = z.infer<typeof ADD_ROLE_SCHEMA>;
export type EditRolePayload = z.infer<typeof EDIT_ROLE_SCHEMA>;
