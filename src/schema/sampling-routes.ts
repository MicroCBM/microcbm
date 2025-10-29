import { z } from "zod";

export const ADD_SAMPLING_ROUTE_SCHEMA = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  site_id: z.string().min(1, "Site is required"),
  technician_id: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

export type AddSamplingRoutePayload = z.infer<typeof ADD_SAMPLING_ROUTE_SCHEMA>;
