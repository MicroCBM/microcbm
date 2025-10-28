export interface RecommendationAttachment {
  type: string;
  url: string;
  name: string;
}

export interface Recommendation {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  attachments: RecommendationAttachment[];
  site: {
    id: string;
    name?: string;
  };
  asset: {
    id: string;
    name?: string;
  };
  sampling_point: {
    id: string;
    name?: string;
  };
  recommender: {
    id: string;
    name?: string;
  };
  status?: "open" | "in_progress" | "completed" | "overdue";
  created_at_datetime: string;
  updated_at_datetime: string;
}

export interface AddRecommendationPayload {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  attachments?: RecommendationAttachment[];
  site: {
    id: string;
  };
  asset: {
    id: string;
  };
  sampling_point: {
    id: string;
  };
  recommender: {
    id: string;
  };
}

export interface EditRecommendationPayload {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  attachments?: RecommendationAttachment[];
  site: {
    id: string;
  };
  asset: {
    id: string;
  };
  sampling_point: {
    id: string;
  };
  recommender: {
    id: string;
  };
}
