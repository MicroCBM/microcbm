import { z } from "zod";
import { getRequiredStringSchema } from "./shared";

export const ADD_SAMPLE_SCHEMA = z.object({
  site: z.object({
    id: getRequiredStringSchema("Site ID"),
  }),
  asset: z.object({
    id: getRequiredStringSchema("Asset ID"),
  }),
  sampling_point: z.object({
    id: getRequiredStringSchema("Sampling point ID"),
  }),
  serial_number: getRequiredStringSchema("Serial number"),
  date_sampled: z.number(),
  lab_name: getRequiredStringSchema("Lab name"),
  service_meter_reading: getRequiredStringSchema("Service meter reading"),
  hrs: getRequiredStringSchema("Hours"),
  oil_in_service: getRequiredStringSchema("Oil in service"),
  filter_changed: getRequiredStringSchema("Filter changed"),
  oil_drained: getRequiredStringSchema("Oil drained"),
  severity: getRequiredStringSchema("Severity"),
  wear_metals: z.record(z.string(), z.string()).optional(),
  contaminants: z
    .array(
      z.object({
        type: getRequiredStringSchema("Type"),
        value: z.number(),
        unit: getRequiredStringSchema("Unit"),
      })
    )
    .optional(),
  particle_counts: z
    .array(
      z.object({
        size_range: getRequiredStringSchema("Size range"),
        count: z.number(),
        unit: getRequiredStringSchema("Unit"),
      })
    )
    .optional(),
  viscosity_levels: z
    .array(
      z.object({
        temperature: z.number(),
        viscosity: z.number(),
        unit: getRequiredStringSchema("Unit"),
      })
    )
    .optional(),
  additives: z
    .union([
      z.record(z.string(), z.string()),
      z.array(
        z.object({
          additive: getRequiredStringSchema("Additive"),
          value: getRequiredStringSchema("Value"),
        })
      ),
    ])
    .optional(),
  collection_date: z.string().optional(),
  document_url: z.string().optional(),
});

export const EDIT_SAMPLE_SCHEMA = z.object({
  site: z.object({
    id: getRequiredStringSchema("Site ID"),
  }),
  asset: z.object({
    id: getRequiredStringSchema("Asset ID"),
  }),
  sampling_point: z.object({
    id: getRequiredStringSchema("Sampling point ID"),
  }),
  serial_number: getRequiredStringSchema("Serial number"),
  date_sampled: z.number(),
  lab_name: getRequiredStringSchema("Lab name"),
  service_meter_reading: getRequiredStringSchema("Service meter reading"),
  hrs: getRequiredStringSchema("Hours"),
  oil_in_service: getRequiredStringSchema("Oil in service"),
  filter_changed: getRequiredStringSchema("Filter changed"),
  oil_drained: getRequiredStringSchema("Oil drained"),
  severity: getRequiredStringSchema("Severity"),
  wear_metals: z.record(z.string(), z.string()).optional(),
  contaminants: z
    .array(
      z.object({
        type: getRequiredStringSchema("Type"),
        value: z.number(),
        unit: getRequiredStringSchema("Unit"),
      })
    )
    .optional(),
  particle_counts: z
    .array(
      z.object({
        size_range: getRequiredStringSchema("Size range"),
        count: z.number(),
        unit: getRequiredStringSchema("Unit"),
      })
    )
    .optional(),
  viscosity_levels: z
    .array(
      z.object({
        temperature: z.number(),
        viscosity: z.number(),
        unit: getRequiredStringSchema("Unit"),
      })
    )
    .optional(),
  additives: z
    .union([
      z.record(z.string(), z.string()),
      z.array(
        z.object({
          additive: getRequiredStringSchema("Additive"),
          value: getRequiredStringSchema("Value"),
        })
      ),
    ])
    .optional(),
});

export type AddSamplePayload = z.infer<typeof ADD_SAMPLE_SCHEMA>;
export type EditSamplePayload = z.infer<typeof EDIT_SAMPLE_SCHEMA>;
