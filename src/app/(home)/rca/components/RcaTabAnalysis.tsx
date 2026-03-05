"use client";

import React from "react";
import { Text } from "@/components";
import { RcaChart } from "./RcaChart";
import { RcaTabFishbone } from "./RcaTabFishbone";
import {
  postRcaFiveWhysService,
  putRcaFiveWhysService,
  postRcaLogicTreeService,
  type LogicTreeEvidenceStatus,
} from "@/app/actions/rcas";
import type { RcaRecord } from "@/types";
import type { RcaNodeData } from "@/types";
import { toast } from "sonner";

/** Map UI evidenceStatus to API: Evidence|Pending|Rejected */
function toLogicTreeEvidenceStatus(
  status: RcaNodeData["evidenceStatus"]
): LogicTreeEvidenceStatus {
  if (status === "Confirmed") return "Evidence";
  if (status === "Rejected" || status === "Pending") return status;
  return "Pending";
}

/** Return cause nodes (not problem/why) in BFS order so parents are before children. */
function getLogicTreeCauseNodesInOrder(
  nodes: RcaRecord["nodes"],
  edges: RcaRecord["edges"]
): RcaRecord["nodes"] {
  const problemId = nodes.find((n) => n.data?.type === "problem")?.id ?? nodes[0]?.id;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const childrenOf = new Map<string, string[]>();
  for (const e of edges) {
    if (!childrenOf.has(e.source)) childrenOf.set(e.source, []);
    childrenOf.get(e.source)!.push(e.target);
  }
  console.log("[Logic tree getCauseNodes] nodes:", nodes.length, nodes.map((n) => ({ id: n.id, type: n.data?.type })));
  console.log("[Logic tree getCauseNodes] edges:", edges.length, edges.map((e) => ({ source: e.source, target: e.target })));
  console.log("[Logic tree getCauseNodes] problemId:", problemId, "childrenOf:", Object.fromEntries(childrenOf));
  const ordered: RcaRecord["nodes"] = [];
  const visited = new Set<string>();
  const queue = [problemId].filter(Boolean);
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const node = byId.get(id);
    if (node && node.data?.type !== "problem" && node.data?.type !== "why") {
      ordered.push(node);
    }
    for (const childId of childrenOf.get(id) ?? []) {
      if (!visited.has(childId)) queue.push(childId);
    }
  }
  console.log("[Logic tree getCauseNodes] ordered cause count:", ordered.length, ordered.map((n) => n.id));
  return ordered;
}

interface RcaTabAnalysisProps {
  record: RcaRecord;
  onRecordChange: (record: RcaRecord) => void;
}

export function RcaTabAnalysis({ record, onRecordChange }: RcaTabAnalysisProps) {
  const template = record.template === "fishbone" || record.template === "logic-tree" || record.template === "5whys"
    ? record.template
    : "5whys";

  const handleSave = (nodes: RcaRecord["nodes"], edges: RcaRecord["edges"]) => {
    const next = {
      ...record,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };
    onRecordChange(next);
    toast.success("Analysis saved.");

    if (template === "5whys" && record.id && record.initiatedById) {
      const whyNodes = nodes
        .filter((n) => n.data?.type === "why" || /^why-\d+$/.test(n.id))
        .sort((a, b) => {
          const levelA = parseInt((a.id.match(/why-(\d+)/) ?? [])[1] ?? "0", 10);
          const levelB = parseInt((b.id.match(/why-(\d+)/) ?? [])[1] ?? "0", 10);
          return levelA - levelB;
        });
      const payloadFor = (node: RcaRecord["nodes"][0]) => {
        const data = node.data as RcaNodeData & { evidenceReference?: string };
        const levelMatch = node.id.match(/why-(\d+)/);
        const level = levelMatch ? levelMatch[1] : "1";
        const label = (data?.label ?? "").trim();
        return {
          rca_id: record.id,
          level,
          statement: [label],
          evidence_reference: String(data?.evidenceReference ?? "").trim(),
          created_by: { id: record.initiatedById! },
        };
      };
      const createdIds = new Map<string, string>();
      let index = 0;
      const runNext = () => {
        if (index >= whyNodes.length) {
          if (createdIds.size > 0) {
            const updatedNodes = nodes.map((n) => {
              const entryId = createdIds.get(n.id);
              if (!entryId) return n;
              return { ...n, data: { ...n.data, fiveWhysEntryId: entryId } };
            });
            onRecordChange({
              ...record,
              nodes: updatedNodes,
              edges: record.edges,
              updatedAt: new Date().toISOString(),
            });
          }
          return;
        }
        const node = whyNodes[index];
        const data = node.data as RcaNodeData & { evidenceReference?: string };
        const label = (data?.label ?? "").trim();
        const isPlaceholder = !label || label === "Why?" || /^\d+(st|nd|rd|th) Why\?$/.test(label);
        if (isPlaceholder) {
          index += 1;
          runNext();
          return;
        }
        const payload = payloadFor(node);
        const entryId = (node.data as RcaNodeData).fiveWhysEntryId;
        const request = entryId
          ? putRcaFiveWhysService(entryId, payload)
          : postRcaFiveWhysService(payload);
        request
          .then((res) => {
            if (!res.success) {
              toast.error(res.message ?? "Failed to save 5 Whys entry.");
            } else if (!entryId && res.data) {
              const body = res.data as { data?: { id?: string } };
              const id = body?.data?.id;
              if (id) createdIds.set(node.id, id);
            }
            index += 1;
            runNext();
          })
          .catch(() => {
            toast.error("Failed to save 5 Whys entry.");
            index += 1;
            runNext();
          });
      };
      runNext();
    }

    if (template === "logic-tree" && record.id) {
      console.log("[Logic tree Save] handleSave received nodes:", nodes.length, "edges:", edges.length);
      console.log("[Logic tree Save] nodes:", nodes.map((n) => ({ id: n.id, dataType: n.data?.type })));
      console.log("[Logic tree Save] edges:", edges);
      const problemId = nodes.find((n) => n.data?.type === "problem")?.id ?? nodes[0]?.id;
      const parentByChild = new Map<string, string>();
      for (const e of edges) parentByChild.set(e.target, e.source);
      const causeNodesOrdered = getLogicTreeCauseNodesInOrder(nodes, edges);
      if (causeNodesOrdered.length === 0) {
        console.log("[Logic tree] No cause nodes — API not called. Add cause nodes and save to run the endpoint.");
        toast.info("Chart saved locally. Add cause nodes (Add cause) and save again to sync to the server.");
        return;
      }
      console.log("[Logic tree] Calling endpoint for", causeNodesOrdered.length, "cause node(s).");
      const clientToBackendId = new Map<string, string>();
      // Do not map problem node to RCA id — parent_node is only for existing logic-tree entries.

      const postNext = (index: number) => {
        if (index >= causeNodesOrdered.length) return;
        const node = causeNodesOrdered[index];
        const data = node.data as RcaNodeData;
        const parentClientId = parentByChild.get(node.id) ?? problemId;
        const parentBackendId = clientToBackendId.get(parentClientId ?? "");
        const hypothesis = (data?.hypothesis ?? data?.label ?? "").trim();
        // Only include parent_node when parent is an existing logic-tree node (not the problem/root).
        const payload: Parameters<typeof postRcaLogicTreeService>[0] = {
          rca_id: record.id!,
          hypothesis: hypothesis || "Cause",
          evidence_status: toLogicTreeEvidenceStatus(data?.evidenceStatus),
          supporting_evidence: (data?.supportingEvidence ?? "").trim(),
        };
        if (parentBackendId) payload.parent_node = { id: parentBackendId };
        console.log("[Logic tree Save] payload (node " + (index + 1) + "/" + causeNodesOrdered.length + "):", payload);
        postRcaLogicTreeService(payload)
          .then((res) => {
            console.log("[Logic tree] Response:", res);
            if (res.success && res.data) {
              const body = res.data as { data?: { id?: string } };
              const backendId = body?.data?.id;
              if (backendId) clientToBackendId.set(node.id, backendId);
            } else {
              toast.error(res.message ?? "Failed to save logic tree node.");
            }
            postNext(index + 1);
          })
          .catch(() => {
            toast.error("Failed to save logic tree node.");
            postNext(index + 1);
          });
      };
      postNext(0);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b bg-white">
        <Text variant="h6">Analysis</Text>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {(template === "5whys" || template === "logic-tree") && (
          <RcaChart
            initialNodes={record.nodes}
            initialEdges={record.edges}
            onSave={handleSave}
            title={record.title}
            rcaId={record.id}
            template={template}
            hideHeader
          />
        )}
        {template === "fishbone" && (
          <RcaTabFishbone
            entries={record.fishboneEntries ?? []}
            problemLabel={record.problemStatementDetails?.focalPoint ?? record.title ?? "Problem"}
            rcaId={record.id}
            onChange={(fishboneEntries) =>
              onRecordChange({
                ...record,
                fishboneEntries,
                updatedAt: new Date().toISOString(),
              })
            }
          />
        )}
      </div>
    </div>
  );
}
