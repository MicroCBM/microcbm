interface SamplingRoute {
  id: string;
  name: string;
  description: string;
  site: {
    id: string;
    name: string;
    tag: string;
    installation_environment: string;
    regulations_and_standards: string[];
  };
  technician?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
  };
  status: string;
  created_at: number;
  created_at_datetime: string;
  updated_at: number;
  updated_at_datetime: string;
}

export type { SamplingRoute };
