interface Asset {
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
}

interface Sites {
  address: string;
  attachments: unknown;
  city: string;
  country: string;
  created_at: number;
  created_at_datetime: string;
  description: string;
  id: string;
  installation_environment: string;
  manager_email: string;
  manager_location: string;
  manager_name: string;
  manager_phone_number: string;
  members: unknown;
  name: string;
  organization: {
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    industry: string;
    logo_url: string;
    members: unknown;
    name: string;
    owner: unknown;
    sites: unknown;
    team_strength: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  regulations_and_standards: string[];
  tag: string;
  updated_at: number;
  updated_at_datetime: string;
}

interface SitesAnalytics {
  issues_trend_percentage: number;
  sites_trend_percentage: number;
  sites_with_issues: number;
  total_sites: number;
}

interface AssetAnalytics {
  total_assets: number;
  asset_trend: {
    growth: number;
    percentage: number;
  };
  critical_assets: {
    total: number;
    trend: {
      growth: number;
      percentage: number;
    };
  };
  assets_with_alarms: {
    total: number;
    trend: {
      growth: number;
      percentage: number;
    };
  };
}

export type { Asset, Sites, SitesAnalytics, AssetAnalytics };
