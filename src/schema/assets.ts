import { z } from "zod";
import { getOptionalStringSchema, getRequiredStringSchema } from "./shared";

export const ADD_ASSET_SCHEMA = z.object({
  name: getRequiredStringSchema("Name"),
  tag: getRequiredStringSchema("Tag"),
  parent_site: z.object({
    id: getRequiredStringSchema("Parent site ID"),
  }),
  type: getRequiredStringSchema("Type"),
  equipment_class: getOptionalStringSchema(),
  manufacturer: getOptionalStringSchema(),
  is_modified: z.boolean().optional(),
  model_number: getRequiredStringSchema("Model number"),
  serial_number: getRequiredStringSchema("Serial number"),
  criticality_level: getRequiredStringSchema("Critical level"),
  operating_hours: getRequiredStringSchema("Operating hours"),
  commissioned_date: getRequiredStringSchema("Commissioned date"),
  status: getRequiredStringSchema("Status"),
  maintenance_strategy: getRequiredStringSchema("Maintenance strategy"),
  last_performed_maintenance: getRequiredStringSchema(
    "Last performed maintenance"
  ),
  major_overhaul: getRequiredStringSchema("Major overhaul date"),
  last_date_overhaul: getRequiredStringSchema("Last overhaul date"),
  assignee: z.object({
    id: getRequiredStringSchema("Assignee ID"),
  }),
  power_rating: getRequiredStringSchema("Power rating (Kw)"),
  speed: getRequiredStringSchema("Speed (RPM)"),
  capacity: getRequiredStringSchema("Capacity (m3/h)"),
  datasheet: z
    .object({
      file_url: z.string().url("Please enter a valid URL").optional(),
      file_name: z.string().min(1, "File name is required"),
      uploaded_at: z.string().min(1, "Uploaded at is required"),
    })
    .optional(),
});

export type AddAssetPayload = z.infer<typeof ADD_ASSET_SCHEMA>;
