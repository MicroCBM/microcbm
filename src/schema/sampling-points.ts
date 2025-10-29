import { z } from "zod";

export const ADD_SAMPLING_POINT_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  tag: z.string().min(1, "Tag is required"),
  parent_asset: z.object({
    id: z.string().min(1, "Parent asset ID is required"),
  }),
  circuit_type: z.string().min(1, "Circuit type is required"),
  component_type: z.string().min(1, "Component type is required"),
  sample_frequency: z.string().min(1, "Sample frequency is required"),
  system_capacity: z.string().min(1, "System capacity is required"),
  current_oil_grade: z.string().min(1, "Current oil grade is required"),
  status: z.string().min(1, "Status is required"),
  severity: z.string().min(1, "Severity is required"),
  assignee: z.object({
    id: z.string().min(1, "Assignee ID is required"),
  }),
  sampling_route: z.object({
    id: z.string().min(1, "Sampling route ID is required"),
  }),
  sampling_port_type: z.string().min(1, "Sampling port type is required"),
  sampling_port_location: z
    .string()
    .min(1, "Sampling port location is required"),
  lab_destination: z.string().min(1, "Lab destination is required"),
  sampling_volume: z.string().min(1, "Sampling volume is required"),
  special_instructions: z.string().optional(),
  last_sample_date: z.string().min(1, "Last sample date is required"),
  effective_date: z.string().min(1, "Effective date is required"),
  next_due_date: z.string().min(1, "Next due date is required"),
  attachments: z
    .array(
      z.object({
        url: z.string().url("Please enter a valid URL").optional(),
        name: z.string().min(1, "Attachment name is required"),
      })
    )
    .optional(),
});

export type AddSamplingPointPayload = z.infer<typeof ADD_SAMPLING_POINT_SCHEMA>;
