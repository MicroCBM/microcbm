import type {
  RcaRecord,
  RcaTemplateType,
  RcaChartNode,
  RcaChartEdge,
  RcaStatus,
} from "@/types";

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
