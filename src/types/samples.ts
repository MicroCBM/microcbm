export interface WearMetal {
  element: string;
  value: number;
  unit: string;
}

export interface Contaminant {
  type: string;
  value: number;
  unit: string;
}

export interface ParticleCount {
  size_range: string;
  count: number;
  unit: string;
}

export interface ViscosityLevel {
  temperature: number;
  viscosity: number;
  unit: string;
}

export interface Sample {
  id: string;
  site: {
    id: string;
    name?: string;
  };
  asset: {
    id: string;
    name?: string;
  };
  sampling_point: {
    id: string;
    name?: string;
  };
  serial_number: string;
  date_sampled: number;
  lab_name: string;
  service_meter_reading: string;
  hrs: string;
  oil_in_service: string;
  filter_changed: string;
  oil_drained: string;
  severity: string;
  wear_metals: WearMetal[];
  contaminants: Contaminant[];
  particle_counts: ParticleCount[];
  viscosity_levels: ViscosityLevel[];
  created_at_datetime: string;
  updated_at_datetime: string;
}

export interface SampleFilters {
  search?: string;
  severity?: string;
  site?: string;
  asset?: string;
  sampling_point?: string;
}
