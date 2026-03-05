import type {
  RcaRecord,
  RcaTemplateType,
  RcaChartNode,
  RcaChartEdge,
  RcaStatus,
  RcaAction,
  RcaProblemStatement,
} from "@/types";
import type { RcaApiListItem } from "@/app/actions/rcas";

const LIST_KEY = "microcbm-rca-list";

/** Generate RCA-YYYY-XXXX (e.g. RCA-2026-0001) */
export function generateRcaId(): string {
  const list = getRcaList();
  const year = new Date().getFullYear();
  const prefix = `RCA-${year}-`;
  const sameYear = list.filter((r) => r.rcaId?.startsWith(prefix));
  const maxNum = sameYear.reduce((acc, r) => {
    const match = r.rcaId?.replace(prefix, "");
    const n = parseInt(match ?? "0", 10);
    return isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `${prefix}${String(maxNum + 1).padStart(4, "0")}`;
}

export function getRcaList(): RcaRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    const list: RcaRecord[] = raw ? JSON.parse(raw) : [];
    return list;
  } catch {
    return [];
  }
}

export function saveRcaList(list: RcaRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function getRcaById(id: string): RcaRecord | null {
  const list = getRcaList();
  return list.find((r) => r.id === id) ?? null;
}

export function saveRca(record: RcaRecord): void {
  const list = getRcaList();
  const idx = list.findIndex((r) => r.id === record.id);
  const next = idx >= 0 ? [...list.slice(0, idx), record, ...list.slice(idx + 1)] : [...list, record];
  saveRcaList(next);
}

export function deleteRca(id: string): void {
  saveRcaList(getRcaList().filter((r) => r.id !== id));
}

/** 5 Whys template: focal point + Why? chain (top) + Cause chain (bottom) */
function defaultNodesAndEdges5Whys(): { nodes: RcaChartNode[]; edges: RcaChartEdge[] } {
  const nodes: RcaChartNode[] = [
    {
      id: "focal",
      type: "cause",
      position: { x: 80, y: 180 },
      data: {
        label: "Enter the focus of this investigation...",
        type: "problem",
        color: "#fef3c7",
      },
    },
    { id: "why-1", type: "cause", position: { x: 380, y: 60 }, data: { label: "Why?", type: "why", color: "#e0f2fe" } },
    { id: "why-2", type: "cause", position: { x: 580, y: 60 }, data: { label: "Why?", type: "why", color: "#e0f2fe" } },
    { id: "why-3", type: "cause", position: { x: 780, y: 60 }, data: { label: "Why?", type: "why", color: "#e0f2fe" } },
    { id: "why-4", type: "cause", position: { x: 980, y: 60 }, data: { label: "Why?", type: "why", color: "#e0f2fe" } },
    { id: "cause-1", type: "cause", position: { x: 380, y: 280 }, data: { label: "Cause", type: "cause", color: "#d1fae5" } },
    { id: "cause-2", type: "cause", position: { x: 580, y: 280 }, data: { label: "Cause 2", type: "cause", color: "#d1fae5" } },
  ];
  const edges: RcaChartEdge[] = [
    { id: "e-focal-why1", source: "focal", target: "why-1" },
    { id: "e-why1-why2", source: "why-1", target: "why-2" },
    { id: "e-why2-why3", source: "why-2", target: "why-3" },
    { id: "e-why3-why4", source: "why-3", target: "why-4" },
    { id: "e-focal-cause1", source: "focal", target: "cause-1" },
    { id: "e-cause1-cause2", source: "cause-1", target: "cause-2" },
  ];
  return { nodes, edges };
}

function defaultNodesSologic(): RcaChartNode[] {
  return [
    {
      id: "event-1",
      type: "cause",
      position: { x: 250, y: 80 },
      data: {
        label: "Event / Problem",
        type: "problem",
        color: "#dbeafe",
      },
    },
  ];
}

const LOGIC_TREE_ROOT_ID = "event-1";

/** API logic-tree analysis entry (from GET rcas/:id analysis_entries). */
type LogicTreeAnalysisEntry = {
  id?: string;
  parent_node?: { id?: string };
  hypothesis?: string;
  evidence_status?: string;
  supporting_evidence?: string;
};

/** Map API evidence_status to UI evidenceStatus. */
function mapEvidenceStatus(apiStatus: string | undefined): "Confirmed" | "Rejected" | "Pending" {
  if (apiStatus === "Evidence") return "Confirmed";
  if (apiStatus === "Rejected" || apiStatus === "Pending") return apiStatus;
  return "Pending";
}

/** Build chart nodes and edges from analysis_entries for Logic Tree. */
function mapAnalysisEntriesToLogicTree(
  entries: unknown[]
): { nodes: RcaChartNode[]; edges: RcaChartEdge[] } {
  const list = entries as LogicTreeAnalysisEntry[];
  if (!list.length) {
    return { nodes: defaultNodesSologic(), edges: [] };
  }
  const entryIds = new Set(list.map((e) => e.id).filter(Boolean));
  const nodes: RcaChartNode[] = [
    {
      id: LOGIC_TREE_ROOT_ID,
      type: "cause",
      position: { x: 250, y: 80 },
      data: {
        label: "Event / Problem",
        type: "problem",
        color: "#dbeafe",
      },
    },
  ];
  const edges: RcaChartEdge[] = [];
  let y = 180;
  let x = 200;
  for (const entry of list) {
    const id = (entry.id as string) ?? `node-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const parentId =
      entry.parent_node?.id && entryIds.has(entry.parent_node.id)
        ? entry.parent_node.id
        : LOGIC_TREE_ROOT_ID;
    nodes.push({
      id,
      type: "cause",
      position: { x: x + Math.random() * 80, y },
      data: {
        label: (entry.hypothesis as string) ?? "Cause",
        hypothesis: entry.hypothesis,
        evidenceStatus: mapEvidenceStatus(entry.evidence_status),
        supportingEvidence: entry.supporting_evidence ?? "",
        type: "cause",
        color: "#d1fae5",
      },
    });
    edges.push({ id: `e-${parentId}-${id}`, source: parentId, target: id });
    y += 100;
    if (y > 400) {
      y = 180;
      x += 220;
    }
  }
  return { nodes, edges };
}

export function getDefaultNodesForTemplate(template: RcaTemplateType | undefined): RcaChartNode[] {
  const t = template === "sologic" ? "logic-tree" : template;
  if (t === "5whys") return defaultNodesAndEdges5Whys().nodes;
  if (t === "logic-tree") return defaultNodesSologic();
  if (t === "fishbone") return defaultNodesFishbone();
  return defaultNodesSologic();
}

function defaultNodesFishbone(): RcaChartNode[] {
  return [
    {
      id: "fishbone-problem",
      type: "cause",
      position: { x: 400, y: 120 },
      data: {
        label: "Problem / Effect",
        type: "problem",
        color: "#fef3c7",
      },
    },
  ];
}

export function getDefaultEdgesForTemplate(template: RcaTemplateType | undefined): RcaChartEdge[] {
  const t = template === "sologic" ? "logic-tree" : template;
  if (t === "5whys") return defaultNodesAndEdges5Whys().edges;
  return [];
}

/** API impact kind (Actual) to UI category */
const KIND_ACTUAL_TO_CATEGORY: Record<string, string> = {
  ASafety: "Personnel Health",
  AEnvironmental: "Environmental",
  ACost: "Asset",
  ARevenue: "Production",
  ACustomerService: "Reputation",
  AInvestigationCosts: "Personnel Health",
};
/** API impact kind (Potential) to UI category */
const KIND_POTENTIAL_TO_CATEGORY: Record<string, string> = {
  PSafety: "Personnel Health",
  PEnvironmental: "Environmental",
  PCost: "Asset",
  PRevenue: "Production",
  PCustomerService: "Reputation",
};

type ApiImpact = { id?: string; kind?: string; description?: string; amount?: string };

/** Map API problem_statement (snake_case) to RcaProblemStatement (camelCase). Returns {} when missing. */
function mapApiProblemStatementToDetails(
  ps: RcaApiListItem["problem_statement"]
): RcaProblemStatement {
  if (!ps || typeof ps !== "object") return {};
  const impacts = (ps as { impacts?: ApiImpact[] }).impacts ?? [];
  const actualImpact: RcaProblemStatement["actualImpact"] = [];
  const potentialImpact: RcaProblemStatement["potentialImpact"] = [];
  type CostLevel = "Low" | "Medium" | "High";
  for (const imp of impacts) {
    const kind = imp.kind ?? "";
    const category =
      kind.startsWith("A")
        ? KIND_ACTUAL_TO_CATEGORY[kind] ?? "Personnel Health"
        : KIND_POTENTIAL_TO_CATEGORY[kind] ?? "Personnel Health";
    const cost: CostLevel | undefined =
      imp.amount === "Low" || imp.amount === "Medium" || imp.amount === "High" ? (imp.amount as CostLevel) : undefined;
    const entry = { category, description: imp.description ?? "", cost };
    if (kind.startsWith("A")) {
      actualImpact.push(entry);
    } else {
      potentialImpact.push(entry);
    }
  }
  return {
    focalPoint: ps.focal_point,
    startDate: ps.start_date,
    endDate: ps.end_date,
    uniqueTiming: ps.unique_timing,
    businessUnit: ps.business_unit,
    location: ps.location,
    productClass: ps.product_class,
    resourceType: ps.resource_type,
    frequency: ps.frequency_count,
    frequencyUnit: ps.frequency_schedule,
    frequencyNotes: ps.frequency_notes,
    actualImpact: actualImpact.length > 0 ? actualImpact : undefined,
    potentialImpact: potentialImpact.length > 0 ? potentialImpact : undefined,
  };
}

/** Map GET /rcas/:id response.data to RcaRecord for the UI. */
export function mapApiRcaToRecord(api: RcaApiListItem): RcaRecord {
  const methodToTemplate: Record<string, RcaTemplateType> = {
    FiveWhys: "5whys",
    LogicTree: "logic-tree",
    Fishbone: "fishbone",
    Sologic: "sologic",
  };
  const template = methodToTemplate[api.method ?? ""] ?? "5whys";
  const defaultNodes = getDefaultNodesForTemplate(template);
  const defaultEdges = getDefaultEdgesForTemplate(template);
  const hasAnalysisEntries =
    api.method === "LogicTree" &&
    Array.isArray(api.analysis_entries) &&
    api.analysis_entries.length > 0;
  const { nodes, edges } = hasAnalysisEntries
    ? mapAnalysisEntriesToLogicTree(api.analysis_entries as unknown[])
    : { nodes: defaultNodes, edges: defaultEdges };
  const leader = api.rca_leader;
  const leaderName =
    leader && (leader.first_name || leader.last_name || leader.email)
      ? [leader.first_name, leader.last_name].filter(Boolean).join(" ") || leader.email
      : undefined;
  const initiatedBy = api.initiated_by;
  const initiatedByName =
    initiatedBy && (initiatedBy.first_name || initiatedBy.last_name || initiatedBy.email)
      ? [initiatedBy.first_name, initiatedBy.last_name].filter(Boolean).join(" ") || initiatedBy.email
      : undefined;
  const orgId = api.organization?.id;
  const asset = api.parent_asset as { id?: string; name?: string; tag?: string; parent_site?: { id?: string } } | null | undefined;
  const assetTag = asset?.tag ?? (api.parent_asset ? "" : undefined);
  const psMapped = mapApiProblemStatementToDetails(api.problem_statement);
  const psHasKeys = psMapped && Object.keys(psMapped).length > 0;
  const problemStatementDetails: RcaRecord["problemStatementDetails"] = psHasKeys
    ? {
        ...psMapped,
        productClass: (psMapped?.productClass as string)?.trim() ? psMapped.productClass : (api.parent_asset?.id ?? psMapped?.productClass),
        resourceType: (psMapped?.resourceType as string)?.trim() ? psMapped.resourceType : (assetTag ?? (api.parent_asset ? "" : undefined) ?? psMapped?.resourceType),
      }
    : orgId || api.parent_asset
      ? {
          ...psMapped,
          businessUnit: psMapped?.businessUnit ?? orgId,
          location: psMapped?.location ?? asset?.parent_site?.id,
          productClass: psMapped?.productClass ?? api.parent_asset?.id,
          resourceType: psMapped?.resourceType ?? assetTag ?? (api.parent_asset ? "" : undefined),
        }
      : psMapped;

  return {
    id: api.id,
    rcaId: api.id,
    title: api.title,
    template,
    nodes,
    edges,
    createdAt: api.created_at_datetime ?? new Date().toISOString(),
    updatedAt: api.updated_at_datetime ?? new Date().toISOString(),
    status: "Draft",
    assetId: api.parent_asset?.id,
    assetName: api.parent_asset?.name,
    departmentId: api.department?.id,
    departmentName: api.department?.name,
    eventDate: api.event_date,
    rcaLeaderId: api.rca_leader?.id,
    rcaLeaderName: leaderName,
    severityLevel: (api.severity as RcaRecord["severityLevel"]) ?? undefined,
    mapLocation: api.physical_location,
    notes: api.notes,
    types: api.type,
    tags: api.tags,
    initiatedById: api.initiated_by?.id,
    initiatedByName,
    organization: orgId,
    assetTag: assetTag ?? (api.parent_asset ? "" : undefined),
    problemStatementId: api.problem_statement?.id,
    problemStatementDetails,
    evidence: Array.isArray(api.evidence)
      ? (api.evidence as { id: string; text: string; type?: string; fileName?: string; attachments?: string[] }[]).map(
          (e) => {
            const attachments = e.attachments ?? [];
            const firstAttachment = attachments[0];
            const isFileKey = typeof firstAttachment === "string" && !firstAttachment.startsWith("data:");
            const type = (e.type as "text" | "observation") ?? (isFileKey ? "observation" : "text");
            const fileName =
              e.fileName ??
              (isFileKey && firstAttachment ? firstAttachment.split("/").pop() ?? firstAttachment : undefined);
            return {
              id: e.id ?? `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              text: e.text ?? "",
              type,
              fileName,
              attachments: e.attachments,
            };
          }
        )
      : [],
    finalReport:
      api.executive_summary !== undefined || api.cause_and_effective_summary !== undefined
        ? {
            executiveSummary: api.executive_summary,
            causeAndEffectSummary: api.cause_and_effective_summary,
          }
        : undefined,
    actions: Array.isArray(api.actions)
      ? (api.actions as Record<string, unknown>[]).map((a) => {
          const owner = a.owner as { id?: string } | undefined;
          const verifiedBy = a.verified_by as { id?: string } | undefined;
          return {
            id: (a.id as string) ?? `act-${Date.now()}`,
            actionType: ((a.action_type as string) ?? "Corrective") as RcaAction["actionType"],
            description: (a.description as string) ?? "",
            ownerId: owner?.id,
            dueDate: a.due_date as string | undefined,
            priority: ((a.priority as string) ?? "Medium") as RcaAction["priority"],
            status: ((a.status as string) ?? "Open") as RcaAction["status"],
            verificationRequired: Boolean(a.verification_required),
            verifiedById: verifiedBy?.id,
            verificationDate: a.verified_at as string | undefined,
            effectivenessReviewDate: a.effectiveness_review_date as string | undefined,
            createdAt: (a.created_at as string) ?? new Date().toISOString(),
          };
        })
      : undefined,
  };
}

export interface CreateRcaFormData {
  name: string;
  template: RcaTemplateType;
  assetId?: string;
  assetName?: string;
  departmentId?: string;
  departmentName?: string;
  eventDate?: string;
  rcaLeaderId?: string;
  rcaLeaderName?: string;
  severityLevel?: string;
  averageActualRisk?: "High" | "Medium" | "Low";
  potentialRiskImpact?: "High" | "Medium" | "Low";
  mapLocation?: string;
  severity?: string;
  organization?: string;
  notes?: string;
  types?: string;
  tags?: string;
  owner?: string;
  facilitator?: string;
  initiatedById?: string;
  initiatedByName?: string;
  assetTag?: string;
}

export function createRcaRecordFromForm(data: CreateRcaFormData): RcaRecord {
  const now = new Date().toISOString();
  const id = `rca-${Date.now()}`;
  const rcaId = generateRcaId();
  const nodes = getDefaultNodesForTemplate(data.template);
  const edges = getDefaultEdgesForTemplate(data.template);
  const status: RcaStatus = "Draft";
  return {
    id,
    rcaId,
    title: data.name,
    template: data.template,
    status,
    statusHistory: [
      {
        id: `hist-${Date.now()}`,
        previousStatus: "Draft",
        newStatus: "Draft",
        changeDate: now,
      },
    ],
    nodes,
    edges,
    createdAt: now,
    updatedAt: now,
    initiatedAt: now,
    initiatedById: data.initiatedById,
    initiatedByName: data.initiatedByName,
    assetId: data.assetId,
    assetName: data.assetName,
    departmentId: data.departmentId,
    departmentName: data.departmentName,
    eventDate: data.eventDate,
    rcaLeaderId: data.rcaLeaderId,
    rcaLeaderName: data.rcaLeaderName,
    severityLevel: data.severityLevel as RcaRecord["severityLevel"],
    averageActualRisk: data.averageActualRisk,
    potentialRiskImpact: data.potentialRiskImpact,
    mapLocation: data.mapLocation,
    severity: data.severity,
    organization: data.organization,
    notes: data.notes,
    types: data.types,
    tags: data.tags,
    owner: data.owner,
    facilitator: data.facilitator,
    assetTag: data.assetTag,
  };
}

export function createRcaRecord(
  title: string,
  nodes: RcaRecord["nodes"],
  edges: RcaRecord["edges"],
  existing?: Partial<RcaRecord>
): RcaRecord {
  const now = new Date().toISOString();
  const id = existing?.id ?? `rca-${Date.now()}`;
  return {
    ...existing,
    id,
    title,
    template: existing?.template ?? "5whys",
    nodes,
    edges,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
