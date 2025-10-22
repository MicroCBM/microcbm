import { z } from "zod";

export const ADD_ORGANIZATION_SCHEMA = z.object({
  name: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  team_strength: z.string().min(1, "Team strength is required"),
  description: z.string().min(1, "Description is required"),
});

export const EDIT_ORGANIZATION_SCHEMA = z.object({
  name: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  team_strength: z.string().min(1, "Team strength is required"),
  description: z.string().min(1, "Description is required"),
});

export type AddOrganizationPayload = z.infer<typeof ADD_ORGANIZATION_SCHEMA>;
export type EditOrganizationPayload = z.infer<typeof EDIT_ORGANIZATION_SCHEMA>;
