export interface User {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
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
  password_hash: string;
  phone: string;
  role: string;
  role_id: string | null;
  role_obj: unknown;
  site: {
    address: string;
    attachments: null;
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
    organization: unknown;
    regulations_and_standards: unknown;
    tag: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  status: string;
  updated_at: number;
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

interface EditUserPayload {
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
  password?: string;
}

export type { AddUserPayload, EditUserPayload };
