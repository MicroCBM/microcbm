interface Organization {
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

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  date_of_birth: string;
  password_hash: string;
  role: string;
  role_id: string;
  role_obj: unknown;
  status: string;
  organization: {
    id: string;
    name: string;
    logo_url: string;
    team_strength: string;
    industry: string;
    owner: unknown;
    members: unknown;
    sites: unknown;
    description: string;
    created_at: string;
    updated_at: string;
    created_at_datetime: string;
    updated_at_datetime: string;
  };
  site: unknown;
  created_at: string;
  updated_at: string;
  created_at_datetime: string;
  updated_at_datetime: string;
}

interface AddUserPayload {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    country: string;
    date_of_birth: string;
    role_id: string;
    organization: {
      id: string;
    };
    site: {
      id: string;
    };
  };
  password: string;
}

export type { User, Organization, AddUserPayload };
