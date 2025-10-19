interface Asset {
  id: string;
  name: string;
  logo_url: string;
  team_strength: string;
  industry: string;
  owner: string;
  members: unknown;
  sites: unknown;
  description: string;
  created_at: string;
  updated_at: string;
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

export type { Asset, Sites };
