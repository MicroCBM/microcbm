import z from "zod";
import {
  getRequiredEmailSchema,
  getRequiredStringSchema,
  getOptionalStringSchema,
} from "./shared";

export const SIGN_UP_STEP_1_SCHEMA = z.object({
  user: z.object({
    first_name: getRequiredStringSchema("First name"),
    last_name: getRequiredStringSchema("Last name"),
    email: getRequiredEmailSchema("Email"),
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*()]/,
      "Password must contain at least one special character"
    ),
});

export const SIGN_UP_STEP_2_SCHEMA = z.object({
  organization: z.object({
    name: getRequiredStringSchema("Organization name"),
    industry: getRequiredStringSchema("Industry"),
    team_strength: getRequiredStringSchema("Team strength"),
  }),
});

export const SIGN_UP_FULL_SCHEMA = z.object({
  user: SIGN_UP_STEP_1_SCHEMA.shape.user,
  organization: SIGN_UP_STEP_2_SCHEMA.shape.organization.extend({
    logo_url: getOptionalStringSchema(),
  }),
  password: getRequiredStringSchema("Password"),
});
