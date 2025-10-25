import { z } from "zod";

export const ADD_SAMPLE_SCHEMA = z.object({
  site: z.object({
    id: z.string().min(1, "Site ID is required"),
  }),
  asset: z.object({
    id: z.string().min(1, "Asset ID is required"),
  }),
  sampling_point: z.object({
    id: z.string().min(1, "Sampling point ID is required"),
  }),
  serial_number: z.string().min(1, "Serial number is required"),
  date_sampled: z.number(),
  lab_name: z.string().min(1, "Lab name is required"),
  service_meter_reading: z.string().min(1, "Service meter reading is required"),
  hrs: z.string().min(1, "Hours is required"),
  oil_in_service: z.string().min(1, "Oil in service is required"),
  filter_changed: z.string().min(1, "Filter changed is required"),
  oil_drained: z.string().min(1, "Oil drained is required"),
  severity: z.string().min(1, "Severity is required"),
  wear_metals: z.record(z.string()).optional(),
  contaminants: z
    .array(
      z.object({
        type: z.string().min(1, "Type is required"),
        value: z.number(),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .optional(),
  particle_counts: z
    .array(
      z.object({
        size_range: z.string().min(1, "Size range is required"),
        count: z.number(),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .optional(),
  viscosity_levels: z
    .array(
      z.object({
        temperature: z.number(),
        viscosity: z.number(),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .optional(),
});

export const EDIT_SAMPLE_SCHEMA = z.object({
  site: z.object({
    id: z.string().min(1, "Site ID is required"),
  }),
  asset: z.object({
    id: z.string().min(1, "Asset ID is required"),
  }),
  sampling_point: z.object({
    id: z.string().min(1, "Sampling point ID is required"),
  }),
  serial_number: z.string().min(1, "Serial number is required"),
  date_sampled: z.number(),
  lab_name: z.string().min(1, "Lab name is required"),
  service_meter_reading: z.string().min(1, "Service meter reading is required"),
  hrs: z.string().min(1, "Hours is required"),
  oil_in_service: z.string().min(1, "Oil in service is required"),
  filter_changed: z.string().min(1, "Filter changed is required"),
  oil_drained: z.string().min(1, "Oil drained is required"),
  severity: z.string().min(1, "Severity is required"),
  wear_metals: z.record(z.string()).optional(),
  contaminants: z
    .array(
      z.object({
        type: z.string().min(1, "Type is required"),
        value: z.number(),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .optional(),
  particle_counts: z
    .array(
      z.object({
        size_range: z.string().min(1, "Size range is required"),
        count: z.number(),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .optional(),
  viscosity_levels: z
    .array(
      z.object({
        temperature: z.number(),
        viscosity: z.number(),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .optional(),
});

export type AddSamplePayload = z.infer<typeof ADD_SAMPLE_SCHEMA>;
export type EditSamplePayload = z.infer<typeof EDIT_SAMPLE_SCHEMA>;
