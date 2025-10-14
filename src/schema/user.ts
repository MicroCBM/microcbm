import { z } from "zod";

export const ADD_USER_SCHEMA = z.object({
  user: z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.string().min(1, { message: "Role is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    date_of_birth: z.string().min(1, { message: "Date of birth is required" }),
    role_id: z.string().min(1, { message: "Role ID is required" }),
    organization: z.object({
      id: z.string().min(1, { message: "Organization ID is required" }),
    }),
    site: z.object({
      id: z.string().min(1, { message: "Site ID is required" }),
    }),
  }),
  password: z.string().min(1, { message: "Password is required" }),
});
