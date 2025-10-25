export interface Alarm {
  id: string;
  parameter: string;
  site: {
    id: string;
    name?: string;
  };
  first_detected: string;
  acknowledged_status: boolean;
  linked_recommendations: {
    id: string;
    title?: string;
  }[];
  created_at_datetime: string;
  updated_at_datetime: string;
}

export interface AlarmFilters {
  search?: string;
  parameter?: string;
  acknowledged_status?: string;
  site?: string;
}
