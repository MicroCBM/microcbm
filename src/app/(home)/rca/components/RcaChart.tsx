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
import { postRcaLogicTreeService } from "@/app/actions/rcas";
import type { RcaNodeData, RcaChartNode, RcaChartEdge } from "@/types";
import type { RcaTemplateType } from "@/types";
import { Button, Text } from "@/components";
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
      const payload = {
        rca_id: rcaId,
        parent_node: { id: rcaId },
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

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

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
            <Button variant="outline" size="small" onClick={onAddNode} disabled={addingNode}>
              {addingNode ? "Adding…" : "Add cause"}
            </Button>
            <Button variant="outline" size="small" onClick={onDeleteSelected}>
              Delete selected
            </Button>
            {onSave && (
              <Button variant="primary" size="small" onClick={handleSave}>
                Save
              </Button>
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
          <Button variant="outline" size="small" onClick={onAddNode} disabled={addingNode}>
            {addingNode ? "Adding…" : "Add cause"}
          </Button>
          <Button variant="outline" size="small" onClick={onDeleteSelected}>
            Delete selected
          </Button>
          {onSave && (
            <Button variant="primary" size="small" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
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
