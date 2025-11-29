import { z } from "zod";
import { getOptionalStringSchema, getRequiredStringSchema } from "./shared";

export const ADD_SAMPLING_POINT_SCHEMA = z.object({
  name: getRequiredStringSchema("Name"),
  tag: getRequiredStringSchema("Tag"),
  parent_asset: z.object({
    id: getRequiredStringSchema("Parent asset ID"),
  }),
  circuit_type: getRequiredStringSchema("Circuit type"),
  component_type: getRequiredStringSchema("Component type"),
  sample_frequency: getRequiredStringSchema("Sample frequency"),
  system_capacity: getRequiredStringSchema("System capacity"),
  current_oil_grade: getRequiredStringSchema("Current oil grade"),
  status: getRequiredStringSchema("Status"),
  severity: getRequiredStringSchema("Severity"),
  assignee: z.object({
    id: getRequiredStringSchema("Assignee ID"),
  }),
  sampling_route: z.object({
    id: getRequiredStringSchema("Sampling route ID"),
  }),
  sampling_port_type: getRequiredStringSchema("Sampling port type"),
  sampling_port_location: getRequiredStringSchema("Sampling port location"),
  lab_destination: getRequiredStringSchema("Lab destination"),
  sampling_volume: getRequiredStringSchema("Sampling volume"),
  special_instructions: getOptionalStringSchema(),
  last_sample_date: getRequiredStringSchema("Last sample date"),
  effective_date: getRequiredStringSchema("Effective date"),
  next_due_date: getRequiredStringSchema("Next due date"),
  attachments: z
    .array(
      z.object({
        url: z.string().url("Please enter a valid URL").optional(),
        name: getRequiredStringSchema("Attachment name"),
      })
    )
    .optional(),
});

export type AddSamplingPointPayload = z.infer<typeof ADD_SAMPLING_POINT_SCHEMA>;
