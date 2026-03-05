export type RcaNodeType = "problem" | "why" | "cause" | "effect";

/** RCA type for API: type field on GET/POST rcas (Incident|NearMiss|Audit|Others) */
export const RCA_TYPES = ["Incident", "NearMiss", "Audit", "Others"] as const;
export type RcaTypeApi = (typeof RCA_TYPES)[number];

/** Solution attached to a cause node in the chart */
export interface RcaNodeSolution {
  id: string;
  text: string;
}

export interface RcaNodeData extends Record<string, unknown> {
  label: string;
  type?: RcaNodeType;
  color?: string;
  /** Solutions attached to this cause */
  solutions?: RcaNodeSolution[];
  /** Logic Tree: hypothesis text */
  hypothesis?: string;
  /** Logic Tree: evidence status */
  evidenceStatus?: "Confirmed" | "Rejected" | "Pending";
  /** Logic Tree: supporting evidence */
  supportingEvidence?: string;
  /** 5 Whys: backend entry id (for PUT updates) */
  fiveWhysEntryId?: string;
  /** 5 Whys: evidence reference */
  evidenceReference?: string;
}

export interface RcaChartNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: RcaNodeData;
}

export interface RcaChartEdge {
  id: string;
  source: string;
  target: string;
}

/** Investigation method: 5 Whys, Logic Tree, or Fishbone (Ishikawa). @deprecated sologic - use logic-tree */
export type RcaTemplateType = "5whys" | "logic-tree" | "fishbone" | "sologic";

export type RcaTabId = "evidence" | "problem-statement" | "analysis" | "solutions" | "final-report";

/** Lifecycle: Draft → Investigation → Review → Actions Open → Verification → Closed */
export type RcaStatus =
  | "Draft"
  | "Investigation"
  | "Review"
  | "Actions Open"
  | "Verification"
  | "Closed";

export interface RcaStatusHistoryItem {
  id: string;
  previousStatus: RcaStatus;
  newStatus: RcaStatus;
  changedById?: string;
  changedByName?: string;
  changeDate: string;
}

/** Evidence item: text-only or observation (photo/initial report upload) */
export interface RcaEvidenceItem {
  id: string;
  text: string;
  /** For observations: optional caption; for text evidence: the evidence text */
  type?: "text" | "observation";
  /** For observations: original file name */
  fileName?: string;
  /** For observations: data URL (data:image/...) when just added, or file key (e.g. rca-evidence/xxx.webp) when from API */
  attachments?: string[];
}

/** True if the attachment value is an inline data URL; false if it's a storage file key. */
export function isEvidenceDataUrl(value: string | undefined): value is string {
  return typeof value === "string" && value.startsWith("data:");
}

/** API evidence_type enum for POST rcas/:id/evidence (must match backend). */
export const RCA_EVIDENCE_TYPES = [
  "Vibration Report",
  "Oil Analysis",
  "Thermal Image",
  "Inspection Photo",
  "Maintenance Log",
  "SCADA Trend",
  "Other",
] as const;
export type RcaEvidenceType = (typeof RCA_EVIDENCE_TYPES)[number];

/** Corrective Action (spec: rca_actions). API: Corrective|Preventive|Systemic */
export type RcaActionType = "Corrective" | "Preventive" | "Systemic";
export type RcaActionPriority = "Low" | "Medium" | "High" | "Critical";
/** API: Open|InProgress|Completed|Verified|Overdue */
export type RcaActionStatus = "Open" | "InProgress" | "Completed" | "Verified" | "Overdue";

export interface RcaAction {
  id: string;
  actionType: RcaActionType;
  description: string;
  ownerId?: string;
  ownerName?: string;
  departmentId?: string;
  departmentName?: string;
  dueDate?: string;
  priority: RcaActionPriority;
  status: RcaActionStatus;
  verificationRequired: boolean;
  verifiedById?: string;
  verifiedByName?: string;
  verificationDate?: string;
  effectivenessReviewDate?: string;
  createdAt: string;
}

/** Legacy: kept for backward compatibility; maps to RcaAction.description + status */
export interface RcaSolutionItem {
  id: string;
  solution: string;
  status: string;
  assignment?: string;
  dueDate?: string;
}

/** 5 Whys table row (spec: rca_5whys) */
export interface Rca5WhysEntry {
  id: string;
  level: number;
  statement: string;
  evidenceReference?: string;
}

/** Fishbone 6M categories */
export type RcaFishboneCategory =
  | "Man"
  | "Machine"
  | "Method"
  | "Material"
  | "Measurement"
  | "Environment";

export interface RcaFishboneEntry {
  id: string;
  category: RcaFishboneCategory;
  causeDescription: string;
  evidence?: string;
}

export interface RcaProblemStatement {
  focalPoint?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  uniqueTiming?: string;
  mapLocation?: string;
  businessUnit?: string;
  location?: string;
  productClass?: string;
  resourceType?: string;
  actualImpact?: { category: string; description?: string; cost?: "Low" | "Medium" | "High" }[];
  potentialImpact?: { category: string; description?: string; cost?: "Low" | "Medium" | "High" }[];
  investigationCosts?: string;
  actualImpactTotal?: string;
  potentialImpactTotal?: string;
  frequency?: string;
  frequencyUnit?: string;
  frequencyNotes?: string;
}

export interface RcaFinalReport {
  executiveSummary?: string;
  causeAndEffectSummary?: string;
}

/** Failure mode (observable problem) - from master table */
export interface RcaFailureModeRef {
  id: string;
  category: string;
  name: string;
}

/** Root cause category ref - from master table */
export interface RcaRootCauseRef {
  id: string;
  category: string;
  description: string;
}

export interface RcaRecord {
  id: string;
  /** Display ID: RCA-YYYY-XXXX */
  rcaId?: string;
  title: string;
  template?: RcaTemplateType;
  problemStatement?: string;
  nodes: RcaChartNode[];
  edges: RcaChartEdge[];
  createdAt: string;
  updatedAt: string;
  /** Spec: status workflow */
  status?: RcaStatus;
  statusHistory?: RcaStatusHistoryItem[];
  /** Spec: primary header fields */
  assetId?: string;
  assetName?: string;
  departmentId?: string;
  departmentName?: string;
  eventDate?: string;
  initiatedAt?: string;
  initiatedById?: string;
  initiatedByName?: string;
  rcaLeaderId?: string;
  rcaLeaderName?: string;
  severityLevel?: RcaActionPriority;
  /** Average actual risk (replaces productionImpactHours) */
  averageActualRisk?: "High" | "Medium" | "Low";
  /** Potential risk impact (replaces estimatedCostImpact) */
  potentialRiskImpact?: "High" | "Medium" | "Low";
  /** Many-to-many: failure modes */
  failureModeIds?: string[];
  failureModes?: RcaFailureModeRef[];
  /** Many-to-many: root causes identified */
  rootCauseIds?: string[];
  rootCauses?: RcaRootCauseRef[];
  /** 5 Whys structured table (level, statement, evidence) */
  rca5WhysEntries?: Rca5WhysEntry[];
  /** Fishbone entries by 6M category */
  fishboneEntries?: RcaFishboneEntry[];
  /** Corrective Actions (spec: rca_actions) */
  actions?: RcaAction[];
  /** Legacy form fields */
  mapLocation?: string;
  severity?: string;
  groups?: string;
  organization?: string;
  /** Asset tag from create form (locked in Problem Statement when set) */
  assetTag?: string;
  notes?: string;
  types?: string;
  tags?: string;
  owner?: string;
  facilitator?: string;
  teamMembers?: string[];
  evidence?: RcaEvidenceItem[];
  problemStatementDetails?: RcaProblemStatement;
  /** Backend id for problem statement (used for POST impacts) */
  problemStatementId?: string;
  /** Legacy: solutions (if no actions, migrate to actions) */
  solutions?: RcaSolutionItem[];
  finalReport?: RcaFinalReport;
}
