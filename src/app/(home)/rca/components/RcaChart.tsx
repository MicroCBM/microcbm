"use client";

import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Panel,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import { RcaCauseNode } from "./RcaCauseNode";
import { postRcaLogicTreeService, deleteRcaFiveWhysService } from "@/app/actions/rcas";
import type { RcaNodeData, RcaChartNode, RcaChartEdge } from "@/types";
import type { RcaTemplateType } from "@/types";
import { Button, Text } from "@/components";
import { ComponentGuard } from "@/components/content-guard";
import Link from "next/link";
import { ROUTES } from "@/utils/route-constants";
import { toast } from "sonner";
import "@xyflow/react/dist/style.css";

const nodeTypes = { cause: RcaCauseNode };

function toFlowNode(n: RcaChartNode): Node<RcaNodeData> {
  return {
    id: n.id,
    type: "cause",
    position: n.position,
    data: n.data,
  };
}

function toFlowEdge(e: RcaChartEdge): Edge {
  return { id: e.id, source: e.source, target: e.target };
}

const INDENT_STEP_5WHYS = 48;
const Y_STEP_5WHYS = 100;
function position5Whys(index: number) {
  return { x: 60 + INDENT_STEP_5WHYS * index, y: 40 + Y_STEP_5WHYS * index };
}

export interface RcaChartProps {
  initialNodes?: RcaChartNode[];
  initialEdges?: RcaChartEdge[];
  onSave?: (nodes: RcaChartNode[], edges: RcaChartEdge[]) => void;
  rcaId?: string;
  /** When set to "logic-tree", adding a node will POST to rcas/logic-trees when rcaId is present */
  template?: RcaTemplateType;
  title?: string;
  /** When true, hide the top bar (title + Back to list); for embedding in workflow tabs */
  hideHeader?: boolean;
}

function RcaChartInner({
  initialNodes = [],
  initialEdges = [],
  onSave,
  rcaId,
  template,
  title = "New RCA",
  hideHeader = false,
}: RcaChartProps) {
  const [addingNode, setAddingNode] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.length > 0 ? initialNodes.map(toFlowNode) : [
      {
        id: "problem-1",
        type: "cause",
        position: { x: 250, y: 80 },
        data: { label: "Problem / Focus", type: "problem", color: "#fef3c7" },
      },
    ]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(toFlowEdge)
  );

  const onNodesChangeHandler = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      const removedIds = new Set<string>();
      for (const c of changes) {
        const t = (c as { type?: string; id?: string }).type;
        const id = (c as { id?: string }).id;
        if (t === "remove" && id) removedIds.add(id);
      }
      if (removedIds.size > 0 && template === "5whys" && rcaId) {
        for (const id of removedIds) {
          const node = nodes.find((n) => n.id === id);
          const entryId = (node?.data as RcaNodeData)?.fiveWhysEntryId;
          if (entryId) {
            deleteRcaFiveWhysService(rcaId, entryId)
              .then((res) => {
                if (!res.success) toast.error(res.message ?? "Failed to delete 5 Whys entry.");
              })
              .catch(() => toast.error("Failed to delete 5 Whys entry."));
          }
        }
        setEdges((eds) =>
          eds.filter((e) => !removedIds.has(e.source) && !removedIds.has(e.target))
        );
      }
      onNodesChange(changes);
    },
    [template, rcaId, nodes, onNodesChange, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    const parentId = nodes[0]?.id ?? "problem-1";
    const defaultId = `node-${Date.now()}`;
    const newPosition = { x: 250 + Math.random() * 100, y: 200 + Math.random() * 80 };
    const newNode = {
      id: defaultId,
      type: "cause" as const,
      position: newPosition,
      data: { label: "Cause", type: "cause", color: "#d1fae5" } as RcaNodeData,
    };
    const addNodeAndEdge = (nodeId: string) => {
      setNodes((nds) => [...nds, { ...newNode, id: nodeId }]);
      setEdges((eds) => [...eds, { id: `e-${parentId}-${nodeId}`, source: parentId, target: nodeId }]);
    };

    if (template === "logic-tree" && rcaId) {
      setAddingNode(true);
      // Root-level cause: do not send parent_node (RCA id is not a logic-tree table entry).
      const payload = {
        rca_id: rcaId,
        hypothesis: "",
        evidence_status: "Pending" as const,
        supporting_evidence: "",
      };
      console.log("[Logic tree Add cause] payload:", payload);
      postRcaLogicTreeService(payload)
        .then((res) => {
          if (res.success && res.data) {
            const body = res.data as { data?: { id?: string } };
            const id = body?.data?.id ?? defaultId;
            addNodeAndEdge(id);
          } else {
            toast.error(res.message ?? "Failed to add node.");
            addNodeAndEdge(defaultId);
          }
        })
        .catch(() => {
          toast.error("Could not sync to server. Cause added locally—click Save to sync.");
          addNodeAndEdge(defaultId);
        })
        .finally(() => setAddingNode(false));
    } else {
      addNodeAndEdge(defaultId);
    }
  }, [setNodes, setEdges, nodes, template, rcaId]);

  /** For 5whys: insert a new Why node between the last why and root-cause. */
  const onAddWhy = useCallback(() => {
    const rootNode = nodes.find((n) => n.id === "root-cause");
    const edgeIntoRoot = edges.find((e) => e.target === "root-cause");
    if (!rootNode || !edgeIntoRoot) return;
    const lastWhyId = edgeIntoRoot.source;
    const whyNumbers = nodes
      .map((n) => {
        const m = n.id.match(/^why-(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => n > 0);
    const nextNum = whyNumbers.length > 0 ? Math.max(...whyNumbers) + 1 : 3;
    const newWhyId = `why-${nextNum}`;
    const whyCount = nextNum; // 1-based count
    const newPosition = position5Whys(whyCount);
    const rootNewPosition = position5Whys(whyCount + 1);
    setNodes((nds) => {
      const next = nds.map((n) =>
        n.id === "root-cause" ? { ...n, position: rootNewPosition } : n
      );
      next.push({
        id: newWhyId,
        type: "cause",
        position: newPosition,
        data: { label: "", type: "why", color: "#e0f2fe" } as RcaNodeData,
      });
      return next;
    });
    setEdges((eds) => {
      const withoutOld = eds.filter((e) => !(e.source === lastWhyId && e.target === "root-cause"));
      return [
        ...withoutOld,
        { id: `e-${lastWhyId}-${newWhyId}`, source: lastWhyId, target: newWhyId },
        { id: `e-${newWhyId}-root`, source: newWhyId, target: "root-cause" },
      ];
    });
  }, [nodes, edges, setNodes, setEdges]);

  const onDeleteSelected = useCallback(() => {
    const selected = nodes.filter((n) => n.selected);
    if (template === "5whys" && rcaId) {
      for (const n of selected) {
        const entryId = (n.data as RcaNodeData)?.fiveWhysEntryId;
        if (entryId) {
          deleteRcaFiveWhysService(rcaId, entryId)
            .then((res) => {
              if (!res.success) toast.error(res.message ?? "Failed to delete 5 Whys entry.");
            })
            .catch(() => toast.error("Failed to delete 5 Whys entry."));
        }
      }
    }
    const removedIds = new Set(selected.map((n) => n.id));
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) =>
      eds.filter((e) => !e.selected && !removedIds.has(e.source) && !removedIds.has(e.target))
    );
  }, [nodes, template, rcaId, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const outNodes: RcaChartNode[] = nodes.map((n) => ({
      id: n.id,
      type: n.type ?? "cause",
      position: n.position,
      data: n.data as RcaNodeData,
    }));
    const outEdges: RcaChartEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }));
    onSave?.(outNodes, outEdges);
  }, [nodes, edges, onSave]);

  return (
    <div className="flex flex-col h-full">
      {!hideHeader && (
        <div className="flex items-center justify-between gap-4 p-2 border-b bg-white">
          <Text variant="h6">{title}</Text>
          <div className="flex items-center gap-2">
            {template === "5whys" ? (
              <Button variant="outline" size="small" onClick={onAddWhy}>
                Add why
              </Button>
            ) : (
              <Button variant="outline" size="small" onClick={onAddNode} disabled={addingNode}>
                {addingNode ? "Adding…" : "Add cause"}
              </Button>
            )}
            <Button variant="outline" size="small" onClick={onDeleteSelected}>
              Delete selected
            </Button>
            {onSave && (
              <ComponentGuard permissions="rcas:update" unauthorizedFallback={null}>
                <Button variant="primary" size="small" onClick={handleSave}>
                  Save
                </Button>
              </ComponentGuard>
            )}
            <Link href={ROUTES.RCA}>
              <Button variant="ghost" size="small">
                Back to list
              </Button>
            </Link>
          </div>
        </div>
      )}
      {hideHeader && (
        <div className="flex items-center justify-end gap-2 p-2 border-b bg-white">
          {template === "5whys" ? (
            <Button variant="outline" size="small" onClick={onAddWhy}>
              Add why
            </Button>
          ) : (
            <Button variant="outline" size="small" onClick={onAddNode} disabled={addingNode}>
              {addingNode ? "Adding…" : "Add cause"}
            </Button>
          )}
          <Button variant="outline" size="small" onClick={onDeleteSelected}>
            Delete selected
          </Button>
          {onSave && (
            <ComponentGuard permissions="rcas:update" unauthorizedFallback={null}>
              <Button variant="primary" size="small" onClick={handleSave}>
                Save
              </Button>
            </ComponentGuard>
          )}
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Background />
          <Controls />
          <Panel position="top-left" className="text-xs text-gray-500">
            Drag nodes to move • Connect from handle to handle • Select and press Delete to remove
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export function RcaChart(props: RcaChartProps) {
  return (
    <ReactFlowProvider>
      <RcaChartInner {...props} />
    </ReactFlowProvider>
  );
}
