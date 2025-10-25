import { z } from "zod";

const attachmentSchema = z.object({
  type: z.string().min(1, "Attachment type is required"),
  url: z.string().url("Valid URL is required"),
  name: z.string().min(1, "Attachment name is required"),
});

export const ADD_RECOMMENDATION_SCHEMA = z.object({
  title: z.string().min(1, "Title is required"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Severity is required",
  }),
  description: z.string().min(1, "Description is required"),
  attachments: z.array(attachmentSchema).optional(),
  site: z.object({
    id: z.string().min(1, "Site ID is required"),
  }),
  asset: z.object({
    id: z.string().min(1, "Asset ID is required"),
  }),
  sampling_point: z.object({
    id: z.string().min(1, "Sampling point ID is required"),
  }),
  recommender: z.object({
    id: z.string().min(1, "Recommender ID is required"),
  }),
});

export const EDIT_RECOMMENDATION_SCHEMA = z.object({
  title: z.string().min(1, "Title is required"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Severity is required",
  }),
  description: z.string().min(1, "Description is required"),
  attachments: z.array(attachmentSchema).optional(),
  site: z.object({
    id: z.string().min(1, "Site ID is required"),
  }),
  asset: z.object({
    id: z.string().min(1, "Asset ID is required"),
  }),
  sampling_point: z.object({
    id: z.string().min(1, "Sampling point ID is required"),
  }),
  recommender: z.object({
    id: z.string().min(1, "Recommender ID is required"),
  }),
});

export type AddRecommendationPayload = z.infer<
  typeof ADD_RECOMMENDATION_SCHEMA
>;
export type EditRecommendationPayload = z.infer<
  typeof EDIT_RECOMMENDATION_SCHEMA
>;
