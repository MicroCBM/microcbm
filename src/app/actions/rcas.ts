"use server";

import { ApiResponse, handleApiRequest, requestWithAuth } from "./helpers";
import type { RcaEvidenceType, RcaTypeApi } from "@/types/rca";

const commonEndpoint = "/api/v1/";

/** Query params for GET {{base_url}}rcas */
export interface GetRcasParams {
  limit?: number;
  offset?: number;
  organization_id?: string;
  name?: string;
}

/** Single RCA item from GET /rcas response (data.data[]). */
export interface RcaApiListItem {
  id: string;
  title: string;
  method?: string;
  type?: RcaTypeApi;
  severity?: string;
  event_date?: string;
  created_at?: number;
  created_at_datetime?: string;
  updated_at?: number;
  updated_at_datetime?: string;
  department?: { id: string; name?: string };
  organization?: { id: string; name?: string };
  parent_asset?: { id: string; name?: string } | null;
  parent_department?: { id: string; name?: string } | null;
  rca_leader?: { id: string; first_name?: string; last_name?: string; email?: string } | null;
  physical_location?: string;
  notes?: string;
  tags?: string;
  executive_summary?: string;
  cause_and_effective_summary?: string;
  production_impact_in_hours?: string;
  estimated_cost_impact?: string;
  actions?: unknown[];
  analysis_entries?: unknown;
  evidence?: unknown[];
  problem_statement?: {
    id?: string;
    focal_point?: string;
    start_date?: string;
    end_date?: string;
    business_unit?: string;
    location?: string;
    product_class?: string;
    resource_type?: string;
    frequency_count?: string;
    frequency_schedule?: string;
    frequency_notes?: string;
    unique_timing?: string;
    [key: string]: unknown;
  } | null;
  initiated_by?: { id: string; first_name?: string; last_name?: string; email?: string } | null;
}

/** Parsed result from GET /rcas: list is in data.data. */
export interface GetRcasResult {
  list: RcaApiListItem[];
  message?: string;
}

/**
 * GET all RCAs: {{base_url}}/api/v1/rcas?limit&offset&organization_id&name
 */
export async function getRcasService(
  params?: GetRcasParams
): Promise<ApiResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.offset != null) searchParams.set("offset", String(params.offset));
    if (params?.organization_id) searchParams.set("organization_id", params.organization_id);
    if (params?.name) searchParams.set("name", params.name);
    const query = searchParams.toString();
    const url = `${commonEndpoint}rcas${query ? `?${query}` : ""}`;

    const response = await requestWithAuth(url, { method: "GET" });
    const responseText = await response.text();
    let data: Record<string, unknown> | undefined;
    try {
      data = responseText ? JSON.parse(responseText) : undefined;
    } catch {
      if (response.ok) return { success: true, data: undefined };
      return {
        success: false,
        statusCode: response.status,
        message: "Invalid response from server.",
      };
    }
    if (response.ok) return { success: true, data };
    return {
      success: false,
      statusCode: response.status,
      message: (data?.message as string) || "Request failed",
    };
  } catch (error: unknown) {
    const { handleError } = await import("./helpers");
    return handleError(error);
  }
}

/** API payload for POST /rcas (create RCA). Matches backend contract. */
export interface CreateRcaApiPayload {
  title: string;
  method: string;
  type: RcaTypeApi;
  severity: string;
  parent_asset: { id: string };
  parent_department: { id: string };
  department: { id: string };
  organization?: { id: string };
  rca_leader: { id: string };
  event_date: string;
  production_impact_in_hours: string;
  estimated_cost_impact: string;
  physical_location: string;
  notes: string;
  tags: string;
  executive_summary: string;
  cause_and_effective_summary: string;
}

/**
 * GET single RCA by id: {{base_url}}/api/v1/rcas/:id
 */
export async function getRcaByIdService(id: string): Promise<ApiResponse> {
  try {
    const response = await requestWithAuth(`${commonEndpoint}rcas/${id}`, {
      method: "GET",
    });
    const responseText = await response.text();
    let data: Record<string, unknown> | undefined;
    try {
      data = responseText ? JSON.parse(responseText) : undefined;
    } catch {
      if (response.ok) return { success: true, data: undefined };
      return {
        success: false,
        statusCode: response.status,
        message: "Invalid response from server.",
      };
    }
    if (response.ok) return { success: true, data };
    return {
      success: false,
      statusCode: response.status,
      message: (data?.message as string) || "Request failed",
    };
  } catch (error: unknown) {
    const { handleError } = await import("./helpers");
    return handleError(error);
  }
}

/**
 * DELETE {{base_url}}/api/v1/rcas/:id
 */
export async function deleteRcaService(id: string): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/${id}`, undefined, "DELETE");
}

/**
 * Create an RCA via POST {{base_url}}/api/v1/rcas.
 * Returns API response; on success, created RCA id is typically in data.id or data.data.id.
 */
export async function createRcaService(
  payload: CreateRcaApiPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas`, payload, "POST");
}

/** Payload for PUT {{base_url}}rcas/:id/summaries (requires rcas:update). */
export interface PutRcaSummariesPayload {
  executive_summary: string;
  cause_and_effective_summary: string;
}

/**
 * PUT {{base_url}}/api/v1/rcas/:id/summaries
 * Updates executive summary and cause-and-effect summary. Requires rcas:update.
 */
export async function putRcaSummariesService(
  id: string,
  payload: PutRcaSummariesPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/${id}/summaries`, payload, "PUT");
}

/** Category for POST rcas/fish-bones. */
export type FishBoneCategory =
  | "Man"
  | "Machine"
  | "Method"
  | "Material"
  | "Measurement"
  | "Environment";

/** Payload for POST {{base_url}}rcas/fish-bones (requires rcas:create). */
export interface PostRcaFishBonePayload {
  rca_id: string;
  cause: string;
  evidence: string;
  category: FishBoneCategory;
  is_root_cause: boolean;
}

/**
 * POST {{base_url}}/api/v1/rcas/fish-bones
 * Create a fishbone cause. Requires rcas:create.
 */
export async function postRcaFishBoneService(
  payload: PostRcaFishBonePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/fish-bones`, payload, "POST");
}

/** Evidence status for POST rcas/logic-trees. */
export type LogicTreeEvidenceStatus = "Evidence" | "Pending" | "Rejected";

/** Payload for POST {{base_url}}rcas/logic-trees (requires rcas:create). */
export interface PostRcaLogicTreePayload {
  rca_id: string;
  parent_node: { id: string };
  hypothesis: string;
  evidence_status: LogicTreeEvidenceStatus;
  supporting_evidence: string;
}

/**
 * POST {{base_url}}/api/v1/rcas/logic-trees
 * Create a logic-tree node. Requires rcas:create.
 */
export async function postRcaLogicTreeService(
  payload: PostRcaLogicTreePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/logic-trees`, payload, "POST");
}

/** Payload for POST {{base_url}}rcas/five-whys. */
export interface PostRcaFiveWhysPayload {
  rca_id: string;
  level: string;
  statement: string[];
  evidence_reference: string;
  created_by: { id: string };
}

/**
 * POST {{base_url}}/api/v1/rcas/five-whys
 * Create a 5 Whys entry.
 */
export async function postRcaFiveWhysService(
  payload: PostRcaFiveWhysPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/five-whys`, payload, "POST");
}

/** Action type for POST rcas/:id/actions. API: Corrective|Preventive|Systemic */
export type RcaActionTypeApi = "Corrective" | "Preventive" | "Systemic";
/** Priority for POST rcas/:id/actions. */
export type RcaActionPriorityApi = "Low" | "Medium" | "High" | "Critical";
/** Status for POST rcas/:id/actions. API: Open|InProgress|Completed|Verified|Overdue */
export type RcaActionStatusApi = "Open" | "InProgress" | "Completed" | "Verified" | "Overdue";

/** Payload for POST {{base_url}}rcas/:id/actions (requires rcas:create). */
export interface PostRcaActionPayload {
  action_type: RcaActionTypeApi;
  description: string;
  priority: RcaActionPriorityApi;
  status: RcaActionStatusApi;
  owner: { id: string };
  due_date?: string;
  verification_required: boolean;
  verified_by?: { id: string };
  verified_at?: string;
  effectiveness_review_date?: string;
}

/**
 * POST {{base_url}}/api/v1/rcas/:id/actions
 * Create an RCA corrective action. Requires rcas:create.
 */
export async function postRcaActionService(
  rcaId: string,
  payload: PostRcaActionPayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/${rcaId}/actions`, payload, "POST");
}

/** Payload for POST {{base_url}}rcas/:id/problem-statements. */
export interface PostRcaProblemStatementPayload {
  focal_point: string;
  start_date: string;
  end_date: string;
  unique_timing?: string;
  business_unit?: string;
  location?: string;
  product_class?: string;
  resource_type?: string;
  frequency_count?: string;
  frequency_schedule?: string;
  frequency_notes?: string;
}

/**
 * POST {{base_url}}/api/v1/rcas/:id/problem-statements
 * Create a problem statement for an RCA. Returns created problem statement (with id) in response.
 */
export async function postRcaProblemStatementService(
  rcaId: string,
  payload: PostRcaProblemStatementPayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}rcas/${rcaId}/problem-statements`,
    payload,
    "POST"
  );
}

/** Payload for POST {{base_url}}rcas/:id/problem-statements/:psId/impacts. */
export interface PostRcaProblemStatementImpactPayload {
  kind: string;
  description: string;
  amount: string;
}

/**
 * POST {{base_url}}/api/v1/rcas/:id/problem-statements/:psId/impacts
 * Create an impact for a problem statement.
 */
export async function postRcaProblemStatementImpactService(
  rcaId: string,
  psId: string,
  payload: PostRcaProblemStatementImpactPayload
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}rcas/${rcaId}/problem-statements/${psId}/impacts`,
    payload,
    "POST"
  );
}

/** Payload for POST {{base_url}}rcas/:id/evidence. */
export interface PostRcaEvidencePayload {
  description: string;
  attachments: string[];
  evidence_type: RcaEvidenceType;
}

/**
 * POST {{base_url}}/api/v1/rcas/:id/evidence
 * Create an evidence item for an RCA.
 */
export async function postRcaEvidenceService(
  rcaId: string,
  payload: PostRcaEvidencePayload
): Promise<ApiResponse> {
  return handleApiRequest(`${commonEndpoint}rcas/${rcaId}/evidence`, payload, "POST");
}

/**
 * DELETE {{base_url}}/api/v1/rcas/:rcaId/evidence/:evidenceId
 * Delete an evidence item for an RCA.
 */
export async function deleteRcaEvidenceService(
  rcaId: string,
  evidenceId: string
): Promise<ApiResponse> {
  return handleApiRequest(
    `${commonEndpoint}rcas/${rcaId}/evidence/${evidenceId}`,
    undefined,
    "DELETE"
  );
}
