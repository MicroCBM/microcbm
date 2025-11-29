import { z } from "zod";
import { getOptionalStringSchema, getRequiredStringSchema } from "./shared";

export const ADD_SAMPLING_ROUTE_SCHEMA = z.object({
  name: getRequiredStringSchema("Name"),
  description: getRequiredStringSchema("Description"),
  site_id: getRequiredStringSchema("Site ID"),
  technician_id: getOptionalStringSchema(),
  status: getRequiredStringSchema("Status"),
});

export type AddSamplingRoutePayload = z.infer<typeof ADD_SAMPLING_ROUTE_SCHEMA>;
