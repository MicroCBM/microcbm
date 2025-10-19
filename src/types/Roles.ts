interface Role {
  created_at: number;
  created_at_datetime: string;
  id: string;
  level: number;
  name: string;
  permissions: string[];
}

export type { Role };
