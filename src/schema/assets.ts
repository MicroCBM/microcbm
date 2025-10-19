import { z } from "zod";

export const ADD_ASSET_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  tag: z.string().min(1, "Tag is required"),
  parent_site: z.object({
    id: z.string().min(1, "Parent site ID is required"),
  }),
  type: z.string().min(1, "Type is required"),
  equipment_class: z.string().optional(),
  manufacturer: z.string().optional(),
  is_modified: z.boolean().optional(),
  model_number: z.string().min(1, "Model number is required"),
  serial_number: z.string().min(1, "Serial number is required"),
  criticality_level: z.string().min(1, "Critical level is required"),
  operating_hours: z.string().min(1, "Operating hours is required"),
  commissioned_date: z.string().min(1, "Commissioned date is required"),
  status: z.string().min(1, "Status is required"),
  maintenance_strategy: z.string().min(1, "Maintenance strategy is required"),
  last_performed_maintenance: z
    .string()
    .min(1, "Last performed maintenance is required"),
  major_overhaul: z.string().min(1, "Major overhaul date is required"),
  last_date_overhaul: z.string().min(1, "Last overhaul date is required"),
  assignee: z.object({
    id: z.string().min(1, "Assignee ID is required"),
  }),
  power_rating: z.string().min(1, "Power rating (Kw) is required"),
  speed: z.string().min(1, "Speed (RPM) is required"),
  capacity: z.string().min(1, "Capacity (m3/h) is required"),
  datasheet: z
    .object({
      file_url: z.string().url("Please enter a valid URL").optional(),
      file_name: z.string().min(1, "File name is required"),
      uploaded_at: z.string().min(1, "Uploaded at is required"),
    })
    .optional(),
});

export type AddAssetPayload = z.infer<typeof ADD_ASSET_SCHEMA>;
