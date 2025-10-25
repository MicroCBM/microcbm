export interface Department {
  id: string;
  name: string;
  description: string;
  organization: {
    id: string;
    name?: string;
  };
  created_at_datetime: string;
  updated_at_datetime: string;
}

export interface DepartmentFilters {
  search?: string;
  organization_id?: string;
}
