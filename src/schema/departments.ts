import { z } from "zod";

export const ADD_DEPARTMENT_SCHEMA = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
  organization_id: z.string().min(1, "Organization is required"),
});

export const EDIT_DEPARTMENT_SCHEMA = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
  organization_id: z.string().min(1, "Organization is required"),
});

export type AddDepartmentPayload = z.infer<typeof ADD_DEPARTMENT_SCHEMA>;
export type EditDepartmentPayload = z.infer<typeof EDIT_DEPARTMENT_SCHEMA>;
