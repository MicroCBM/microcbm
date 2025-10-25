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
});

export type AddSamplingPointPayload = z.infer<typeof ADD_SAMPLING_POINT_SCHEMA>;
