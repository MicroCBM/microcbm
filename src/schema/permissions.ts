import { z } from "zod";

export const ADD_PERMISSION_SCHEMA = z.object({
  name: z.string().min(1, "Permission name is required"),
  resource: z.string().min(1, "Resource is required"),
  action: z.string().min(1, "Action is required"),
});

export type AddPermissionPayload = z.infer<typeof ADD_PERMISSION_SCHEMA>;

