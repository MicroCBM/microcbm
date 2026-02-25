export type RcaNodeType = "problem" | "why" | "cause" | "effect";

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

export interface RcaEvidenceItem {
  id: string;
  text: string;
  attachments?: string[];
}

/** Corrective Action (spec: rca_actions) */
export type RcaActionType = "Corrective" | "Preventive" | "Systemic";
export type RcaActionPriority = "Low" | "Medium" | "High" | "Critical";
export type RcaActionStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Verified"
  | "Overdue";

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
  actualImpact?: { category: string; description?: string; cost?: string }[];
  potentialImpact?: { category: string; description?: string; cost?: string }[];
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
  productionImpactHours?: number;
  estimatedCostImpact?: number;
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
  notes?: string;
  types?: string;
  tags?: string;
  owner?: string;
  facilitator?: string;
  teamMembers?: string[];
  evidence?: RcaEvidenceItem[];
  problemStatementDetails?: RcaProblemStatement;
  /** Legacy: solutions (if no actions, migrate to actions) */
  solutions?: RcaSolutionItem[];
  finalReport?: RcaFinalReport;
}
