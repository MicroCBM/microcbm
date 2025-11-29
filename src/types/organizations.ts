export interface Organization {
  id: string;
  name: string;
  industry: string;
  team_strength: string;
  description: string;
  logo?: {
    file_url: string;
    file_name: string;
    uploaded_at: string;
  };
  logo_url?: string;
  owner?: {
    first_name: string;
    last_name: string;
  } | null;
  sites?: unknown[];
  created_at_datetime: string;
  updated_at_datetime: string;
}

export interface OrganizationFilters {
  search?: string;
  industry?: string;
  team_strength?: string;
}
