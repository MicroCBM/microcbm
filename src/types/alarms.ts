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

export interface AlarmAnalytics {
  alarm_trend: {
    growth: number;
    percentage: number;
  };
  forecast_alarms: number;
  forecast_trend: {
    growth: number;
    percentage: number;
  };
  open_overdue_alarms: number;
  open_overdue_trend: {
    growth: number;
    percentage: number;
  };
  total_alarms: number;
}
