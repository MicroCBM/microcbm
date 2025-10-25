interface SamplingPoint {
  id: string;
  name: string;
  tag: string;
  parent_asset: {
    id: string;
    name: string;
    tag: string;
    type: string;
    equipment_class: string;
    manufacturer: string;
    model_number: string;
    serial_number: string;
    criticality_level: string;
    operating_hours: string;
    commissioned_date: string;
    status: string;
    maintenance_strategy: string;
    last_performed_maintenance: string;
    major_overhaul: string;
    last_date_overhaul: string;
    power_rating: string;
    speed: string;
    capacity: string;
    is_modified: boolean;
    datasheet: {
      file_url: string;
      file_name: string;
      uploaded_at: string;
    } | null;
    assignee: {
      id: string;
      country: string;
      created_at: number;
      created_at_datetime: string;
      date_of_birth: string;
      email: string;
      first_name: string;
      last_name: string;
      organization: {
        id: string;
        name: string;
        logo_url: string;
        team_strength: string;
        industry: string;
      };
      password_hash: string;
      phone: string;
      role: string;
      role_id: string;
      role_obj: unknown;
      site: {
        id: string;
        name: string;
        tag: string;
        installation_environment: string;
        regulations_and_standards: string[] | null;
      };
      status: string;
      updated_at: number;
      updated_at_datetime: string;
    };
    parent_site: {
      id: string;
      name: string;
      tag: string;
      installation_environment: string;
      regulations_and_standards: string[];
    };
    created_at: number;
    created_at_datetime: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  circuit_type: string;
  component_type: string;
  sample_frequency: string;
  system_capacity: string;
  current_oil_grade: string;
  status: string;
  severity: string;
  created_at: number;
  created_at_datetime: string;
  updated_at: number;
  updated_at_datetime: string;
}

export type { SamplingPoint };
