"use client";

import React, { memo, useState, useCallback, useMemo } from "react";
import { Handle, Position, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Icon } from "@iconify/react";
import type { RcaNodeData, RcaNodeSolution } from "@/types";

type RcaNode = Node<RcaNodeData>;

const COLORS = [
  "#e0f2fe", // sky-100
  "#d1fae5", // emerald-100
  "#fef3c7", // amber-100
  "#e9d5ff", // violet-100
  "#fce7f3", // pink-100
  "#fed7aa", // orange-100
  "#e0e7ff", // indigo-100
  "#ccfbf1", // teal-100
];

function RcaCauseNodeComponent({ data, selected, id }: NodeProps<RcaNode>) {
  const nodeData = data;
  const [label, setLabel] = useState(nodeData.label ?? "Cause");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [newSolutionText, setNewSolutionText] = useState("");
  const bg = nodeData.color ?? "#e0f2fe";
  const solutions = useMemo(() => nodeData.solutions ?? [], [nodeData.solutions]);
  const { setNodes } = useReactFlow();

  const updateData = useCallback(
    (updates: Partial<RcaNodeData>) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...(n.data as RcaNodeData), ...updates } } : n
        )
      );
    },
    [id, setNodes]
  );

  const addSolution = useCallback(() => {
    if (!newSolutionText.trim()) return;
    const next: RcaNodeSolution[] = [
      ...solutions,
      { id: `sol-${Date.now()}`, text: newSolutionText.trim() },
    ];
    updateData({ solutions: next });
    setNewSolutionText("");
  }, [newSolutionText, solutions, updateData]);

  const removeSolution = useCallback(
    (solutionId: string) => {
      updateData({
        solutions: solutions.filter((s) => s.id !== solutionId),
      });
    },
    [solutions, updateData]
  );

  const typeLabel =
    nodeData.type === "problem"
      ? "Event / Problem"
      : nodeData.type === "why"
        ? "Why?"
        : "Cause";

  return (
    <>
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white" />
      <div
        className="relative min-w-[180px] rounded-xl border-2 transition-shadow"
        style={{
          backgroundColor: bg,
          borderColor: selected ? "#2563eb" : "rgba(0,0,0,0.08)",
          boxShadow: selected
            ? "0 4px 14px rgba(37, 99, 235, 0.25)"
            : "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Type badge */}
        <div
          className="rounded-t-[10px] px-3 py-1.5 text-xs font-medium text-slate-600"
          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
        >
          {typeLabel}
        </div>

        {/* Label */}
        <div className="px-3 pt-2 pb-1">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={(e) => updateData({ label: e.target.value })}
            className="w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 focus:ring-0"
            placeholder="Enter focus or cause..."
          />
        </div>

        {/* Color + Solutions controls */}
        <div className="px-3 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowColorPicker((s) => !s)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-white/50 hover:text-slate-700"
              title="Change color"
            >
              <Icon icon="solar:palette-bold-duotone" className="size-3.5" />
              <span>Color</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSolutions((s) => !s)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-white/50 hover:text-slate-700"
              title="Attach solutions"
            >
              <Icon icon="solar:lightbulb-bolt-bold-duotone" className="size-3.5" />
              <span>Solutions {solutions.length > 0 ? `(${solutions.length})` : ""}</span>
            </button>
          </div>

          {showColorPicker && (
            <div className="absolute left-0 top-full mt-1 p-2 bg-white rounded-lg shadow-lg border border-slate-200 z-10 flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-6 h-6 rounded-md border-2 border-slate-200 hover:scale-110 hover:border-slate-400 transition"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    updateData({ color: c });
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}

          {showSolutions && (
            <div className="absolute left-0 top-full mt-1 w-64 p-3 bg-white rounded-xl shadow-lg border border-slate-200 z-10 flex flex-col gap-2">
              <div className="text-xs font-medium text-slate-600">Attach solution to this cause</div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newSolutionText}
                  onChange={(e) => setNewSolutionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSolution();
                    }
                  }}
                  placeholder="Type solution..."
                  className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={addSolution}
                  className="rounded bg-slate-800 text-white px-2 py-1.5 text-xs hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
              {solutions.length > 0 && (
                <ul className="max-h-32 overflow-y-auto space-y-1">
                  {solutions.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-700 group"
                    >
                      <span className="flex-1 min-w-0 truncate">{s.text}</span>
                      <button
                        type="button"
                        onClick={() => removeSolution(s.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
                        aria-label="Remove solution"
                      >
                        <Icon icon="solar:trash-bin-trash-bold" className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white" />
    </>
  );
}

export const RcaCauseNode = memo(RcaCauseNodeComponent);
