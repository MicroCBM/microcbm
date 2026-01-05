import { z } from "zod";

export const ADD_SITES_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  tag: z.string().min(1, "Tag is required"),
  installation_enviroment: z.string().optional(),
  regulations_and_standards: z
    .array(z.string())
    .min(1, "Regulations and standards are required"),
  description: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  organization: z.object({
    id: z.string().min(1, "Organization ID is required"),
  }),
  manager_name: z.string().min(1, "Manager name is required"),
  manager_email: z.string().email("Invalid email address"),
  manager_phone_number: z.string().min(1, "Manager phone number is required"),
  manager_location: z.string().optional(),
  attachments: z
    .array(
      z.object({
        site_map: z.string().url("Please enter a valid URL").optional(),
        permits: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

export const EDIT_SITE_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  tag: z.string().min(1, "Tag is required"),
  installation_enviroment: z.string().optional(),
  regulations_and_standards: z
    .array(z.string())
    .min(1, "Regulations and standards are required"),
  description: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  organization: z.object({
    id: z.string().min(1, "Organization ID is required"),
  }),
  manager_name: z.string().min(1, "Manager name is required"),
  manager_email: z.string().email("Invalid email address"),
  manager_phone_number: z.string().min(1, "Manager phone number is required"),
  manager_location: z.string().optional(),
  attachments: z
    .array(
      z.object({
        site_map: z.string().url("Please enter a valid URL").optional(),
        permits: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

export type AddSitesPayload = z.infer<typeof ADD_SITES_SCHEMA>;
export type EditSitePayload = z.infer<typeof EDIT_SITE_SCHEMA>;
