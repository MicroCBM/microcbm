"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import { postRcaActionService, type PostRcaActionPayload } from "@/app/actions/rcas";
import { getUsersService, type USER_TYPE } from "@/app/actions/user";
import type { RcaAction } from "@/types";
import {
  ACTION_TYPES,
  ACTION_TYPE_LABELS,
  ACTION_PRIORITIES,
  ACTION_STATUSES,
  ACTION_STATUS_LABELS,
} from "../lib/rca-constants";
import { toast } from "sonner";
import { ComponentGuard } from "@/components/content-guard";

const NONE_USER_VALUE = "__none__";

function userLabel(u: USER_TYPE): string {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name || u.email || u.id;
}

interface RcaTabSolutionsProps {
  /** Spec: Corrective Actions. When provided, use this. */
  actions?: RcaAction[];
  onChange: (actions: RcaAction[]) => void;
  /** RCA id for POST rcas/:id/actions (optional; when set, new actions are created via API) */
  rcaId?: string;
  /** Default owner id for new actions (e.g. current user or RCA initiator) */
  createdById?: string;
  /** Optional pre-fetched users for Owner / Verified by dropdowns; otherwise fetched on mount */
  users?: USER_TYPE[];
}

const defaultNewAction = {
  actionType: "Corrective" as RcaAction["actionType"],
  description: "",
  priority: "Medium" as RcaAction["priority"],
  status: "Open" as RcaAction["status"],
  ownerId: "",
  dueDate: "",
  verificationRequired: false,
  verifiedById: "",
  verificationDate: "",
  effectivenessReviewDate: "",
};

export function RcaTabSolutions({ actions = [], onChange, rcaId, createdById, users: usersProp }: RcaTabSolutionsProps) {
  const [newAction, setNewAction] = useState(defaultNewAction);
  const [adding, setAdding] = useState(false);
  const [usersFetched, setUsersFetched] = useState<USER_TYPE[]>([]);
  const list = useMemo(() => actions, [actions]);

  const users = usersProp ?? usersFetched;
  useEffect(() => {
    if (usersProp != null) return;
    getUsersService({ limit: 500 })
      .then(setUsersFetched)
      .catch(() => setUsersFetched([]));
  }, [usersProp]);

  const setNewActionField = useCallback(<K extends keyof typeof defaultNewAction>(
    key: K,
    value: (typeof defaultNewAction)[K]
  ) => {
    setNewAction((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetNewAction = useCallback(() => {
    setNewAction(defaultNewAction);
  }, []);

  const addAction = useCallback(() => {
    if (!newAction.description.trim()) return;
    const newItem: RcaAction = {
      id: `act-${Date.now()}`,
      actionType: newAction.actionType,
      description: newAction.description.trim(),
      priority: newAction.priority,
      status: newAction.status,
      ownerId: newAction.ownerId.trim() || undefined,
      dueDate: newAction.dueDate || undefined,
      verificationRequired: newAction.verificationRequired,
      verifiedById: newAction.verifiedById.trim() || undefined,
      verificationDate: newAction.verificationDate || undefined,
      effectivenessReviewDate: newAction.effectivenessReviewDate || undefined,
      createdAt: new Date().toISOString(),
    };

    if (rcaId) {
      setAdding(true);
      const payload: PostRcaActionPayload = {
        action_type: newItem.actionType,
        description: newItem.description,
        priority: newItem.priority,
        status: newItem.status,
        owner: { id: newItem.ownerId ?? createdById ?? "" },
        verification_required: newItem.verificationRequired,
        ...(newItem.dueDate ? { due_date: newItem.dueDate } : {}),
        ...(newItem.verifiedById ? { verified_by: { id: newItem.verifiedById } } : {}),
        ...(newItem.verificationDate ? { verified_at: newItem.verificationDate } : {}),
        ...(newItem.effectivenessReviewDate ? { effectiveness_review_date: newItem.effectivenessReviewDate } : {}),
      };
      postRcaActionService(rcaId, payload)
        .then((res) => {
          console.log("add action response", res);
          if (res.success && res.data) {
            const body = res.data as { data?: { id?: string } };
            const id = body?.data?.id ?? newItem.id;
            onChange([...list, { ...newItem, id }]);
            resetNewAction();
          } else {
            toast.error(res.message ?? "Failed to add action.");
            onChange([...list, newItem]);
            resetNewAction();
          }
        })
        .finally(() => setAdding(false));
    } else {
      onChange([...list, newItem]);
      resetNewAction();
    }
  }, [newAction, list, onChange, rcaId, createdById, resetNewAction]);

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
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
        <p className="mb-3 text-sm font-medium text-gray-700">Add action</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <div className="sm:col-span-2">
            <Input
              label="Description"
              placeholder="Description of action"
              value={newAction.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewActionField("description", e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAction();
                }
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
            <Select
              value={newAction.actionType}
              onValueChange={(v) => setNewActionField("actionType", v as RcaAction["actionType"])}
            >
              <SelectTrigger className="w-full">
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
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Priority</label>
            <Select
              value={newAction.priority}
              onValueChange={(v) => setNewActionField("priority", v as RcaAction["priority"])}
            >
              <SelectTrigger className="w-full">
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
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <Select
              value={newAction.status}
              onValueChange={(v) => setNewActionField("status", v as RcaAction["status"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ACTION_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Owner</label>
            <Select
              value={newAction.ownerId || createdById || NONE_USER_VALUE}
              onValueChange={(v) => setNewActionField("ownerId", v === NONE_USER_VALUE ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_USER_VALUE}>—</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {userLabel(u)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Due date</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={newAction.dueDate}
              onChange={(e) => setNewActionField("dueDate", e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newAction.verificationRequired}
                onChange={(e) =>
                  setNewActionField("verificationRequired", e.target.checked)
                }
              />
              <span className="text-sm text-gray-600">Verification required</span>
            </label>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Verified by</label>
            <Select
              value={newAction.verifiedById || NONE_USER_VALUE}
              onValueChange={(v) => setNewActionField("verifiedById", v === NONE_USER_VALUE ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_USER_VALUE}>—</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {userLabel(u)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Verified at</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={newAction.verificationDate}
              onChange={(e) => setNewActionField("verificationDate", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Effectiveness review date</label>
            <input
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={newAction.effectivenessReviewDate}
              onChange={(e) => setNewActionField("effectivenessReviewDate", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <ComponentGuard permissions="rcas:create" unauthorizedFallback={null}>
            <Button type="button" variant="primary" size="small" onClick={addAction} disabled={adding}>
              {adding ? "Adding…" : "Add action"}
            </Button>
          </ComponentGuard>
        </div>
      </div>
      <div className="text-sm text-gray-500">Showing {list.length} of {list.length} records</div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        {list.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No corrective actions yet. Add one above.</div>
        ) : (
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">Type</th>
                <th className="text-left p-3 font-medium text-gray-700">Description</th>
                <th className="text-left p-3 font-medium text-gray-700">Priority</th>
                <th className="text-left p-3 font-medium text-gray-700">Status</th>
                <th className="text-left p-3 font-medium text-gray-700">Owner ID</th>
                <th className="text-left p-3 font-medium text-gray-700">Due date</th>
                <th className="text-left p-3 font-medium text-gray-700">Verify</th>
                <th className="text-left p-3 font-medium text-gray-700">Verified by ID</th>
                <th className="text-left p-3 font-medium text-gray-700">Verified at</th>
                <th className="text-left p-3 font-medium text-gray-700">Effectiveness review</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <Select
                      value={item.actionType}
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
                            {ACTION_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Select
                      value={item.ownerId ?? NONE_USER_VALUE}
                      onValueChange={(v) => updateAction(item.id, { ownerId: v === NONE_USER_VALUE ? undefined : v })}
                    >
                      <SelectTrigger className="!border-0 !bg-transparent !h-auto !py-0 !px-1 min-w-[120px]">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_USER_VALUE}>—</SelectItem>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {userLabel(u)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <td className="p-3">
                    <Select
                      value={item.verifiedById ?? NONE_USER_VALUE}
                      onValueChange={(v) => updateAction(item.id, { verifiedById: v === NONE_USER_VALUE ? undefined : v })}
                    >
                      <SelectTrigger className="!border-0 !bg-transparent !h-auto !py-0 !px-1 min-w-[120px]">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_USER_VALUE}>—</SelectItem>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {userLabel(u)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      className="w-full border-0 bg-transparent text-sm outline-none"
                      value={item.verificationDate ?? ""}
                      onChange={(e) =>
                        updateAction(item.id, { verificationDate: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      className="w-full border-0 bg-transparent text-sm outline-none"
                      value={item.effectivenessReviewDate ?? ""}
                      onChange={(e) =>
                        updateAction(item.id, { effectivenessReviewDate: e.target.value })
                      }
                    />
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
      <ComponentGuard permissions="rcas:create" unauthorizedFallback={null}>
        <Button variant="outline" size="small" onClick={addAction} disabled={adding}>
          + Add New
        </Button>
      </ComponentGuard>
    </div>
  );
}
