"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { Button } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/Select";
import type { RcaAction } from "@/types";
import { ACTION_TYPES, ACTION_TYPE_LABELS, ACTION_PRIORITIES, ACTION_STATUSES } from "../lib/rca-constants";

interface RcaTabSolutionsProps {
  /** Spec: Corrective Actions. When provided, use this. */
  actions?: RcaAction[];
  onChange: (actions: RcaAction[]) => void;
}

export function RcaTabSolutions({ actions = [], onChange }: RcaTabSolutionsProps) {
  const [newDescription, setNewDescription] = useState("");
  const list = useMemo(() => actions, [actions]);

  const addAction = useCallback(() => {
    if (!newDescription.trim()) return;
    const newItem: RcaAction = {
      id: `act-${Date.now()}`,
      actionType: "Corrective",
      description: newDescription.trim(),
      priority: "Medium",
      status: "Open",
      verificationRequired: false,
      createdAt: new Date().toISOString(),
    };
    onChange([...list, newItem]);
    setNewDescription("");
  }, [newDescription, list, onChange]);

  const updateAction = useCallback(
    (id: string, updates: Partial<RcaAction>) => {
      onChange(
        list.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    },
    [list, onChange]
  );

  const removeAction = useCallback(
    (id: string) => onChange(list.filter((a) => a.id !== id)),
    [list, onChange]
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <Text variant="h6">Corrective Actions</Text>
      <p className="text-sm text-gray-600">
        Add corrective (CM), preventive (PM), or management of change (MOC) actions. Assign owner, due date, and track verification.
      </p>
      <div className="flex gap-2 items-end">
        <Input
          label="Add action"
          placeholder="Description of action"
          value={newDescription}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewDescription(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addAction();
            }
          }}
          className="flex-1"
        />
        <Button type="button" variant="primary" size="small" onClick={addAction}>
          Add
        </Button>
      </div>
      <div className="text-sm text-gray-500">Showing {list.length} of {list.length} records</div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        {list.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No corrective actions yet. Add one above.</div>
        ) : (
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">Type</th>
                <th className="text-left p-3 font-medium text-gray-700">Description</th>
                <th className="text-left p-3 font-medium text-gray-700">Priority</th>
                <th className="text-left p-3 font-medium text-gray-700">Status</th>
                <th className="text-left p-3 font-medium text-gray-700">Owner</th>
                <th className="text-left p-3 font-medium text-gray-700">Due date</th>
                <th className="text-left p-3 font-medium text-gray-700">Verify</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <Select
                      value={(item.actionType as string) === "Systemic" ? "MOC" : item.actionType}
                      onValueChange={(v) => updateAction(item.id, { actionType: v as RcaAction["actionType"] })}
                    >
                      <SelectTrigger className="!border-0 !bg-transparent !h-auto !py-0 !px-1 min-w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_TYPES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ACTION_TYPE_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border-0 bg-transparent text-sm outline-none min-w-[120px]"
                      value={item.description}
                      onChange={(e) =>
                        updateAction(item.id, { description: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Select
                      value={item.priority}
                      onValueChange={(v) => updateAction(item.id, { priority: v as RcaAction["priority"] })}
                    >
                      <SelectTrigger className="!border-0 !bg-transparent !h-auto !py-0 !px-1 min-w-[90px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_PRIORITIES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Select
                      value={item.status}
                      onValueChange={(v) => updateAction(item.id, { status: v as RcaAction["status"] })}
                    >
                      <SelectTrigger className="!border-0 !bg-transparent !h-auto !py-0 !px-1 min-w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border-0 bg-transparent text-sm outline-none"
                      placeholder="—"
                      value={item.ownerName ?? ""}
                      onChange={(e) =>
                        updateAction(item.id, { ownerName: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      className="w-full border-0 bg-transparent text-sm outline-none"
                      value={item.dueDate ?? ""}
                      onChange={(e) =>
                        updateAction(item.id, { dueDate: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={item.verificationRequired}
                        onChange={(e) =>
                          updateAction(item.id, { verificationRequired: e.target.checked })
                        }
                      />
                      <span className="text-xs">Required</span>
                    </label>
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeAction(item.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Button variant="outline" size="small" onClick={addAction}>
        + Add New
      </Button>
    </div>
  );
}
