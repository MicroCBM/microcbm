import { z } from "zod";

export const ADD_ALARM_SCHEMA = z.object({
  parameter: z.string().min(1, "Parameter is required"),
  site: z.object({
    id: z.string().min(1, "Site ID is required"),
  }),
  first_detected: z.string().min(1, "First detected date is required"),
  acknowledged_status: z.boolean(),
  linked_recommendations: z
    .array(
      z.object({
        id: z.string().min(1, "Recommendation ID is required"),
      })
    )
    .optional(),
});

export const EDIT_ALARM_SCHEMA = z.object({
  parameter: z.string().min(1, "Parameter is required"),
  site: z.object({
    id: z.string().min(1, "Site ID is required"),
  }),
  first_detected: z.string().min(1, "First detected date is required"),
  acknowledged_status: z.boolean(),
  linked_recommendations: z
    .array(
      z.object({
        id: z.string().min(1, "Recommendation ID is required"),
      })
    )
    .optional(),
});

export type AddAlarmPayload = z.infer<typeof ADD_ALARM_SCHEMA>;
export type EditAlarmPayload = z.infer<typeof EDIT_ALARM_SCHEMA>;
