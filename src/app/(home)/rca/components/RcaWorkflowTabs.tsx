"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Text, Button } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/Select";
import { ROUTES } from "@/utils/route-constants";
import { saveRca } from "../lib/rca-storage";
import type { RcaRecord, RcaTabId, RcaStatus } from "@/types";
import { RCA_STATUSES } from "../lib/rca-constants";
import { RcaTabEvidence } from "./RcaTabEvidence";
import { RcaTabProblemStatement } from "./RcaTabProblemStatement";
import { RcaTabAnalysis } from "./RcaTabAnalysis";
import { RcaTabSolutions } from "./RcaTabSolutions";
import { RcaTabFinalReport } from "./RcaTabFinalReport";

const TABS: { id: RcaTabId; label: string }[] = [
  { id: "evidence", label: "Evidence" },
  { id: "problem-statement", label: "Problem Statement" },
  { id: "analysis", label: "Analysis" },
  { id: "solutions", label: "Corrective Actions" },
  { id: "final-report", label: "Final Report" },
];

interface RcaWorkflowTabsProps {
  record: RcaRecord;
  onRecordChange: (record: RcaRecord) => void;
}

export function RcaWorkflowTabs({ record, onRecordChange }: RcaWorkflowTabsProps) {
  const [activeTab, setActiveTab] = useState<RcaTabId>("evidence");

  const updateRecord = useCallback(
    (updates: Partial<RcaRecord>) => {
      const next: RcaRecord = {
        ...record,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveRca(next);
      onRecordChange(next);
    },
    [record, onRecordChange]
  );

  const changeStatus = useCallback(
    (newStatus: RcaStatus) => {
      const prev = record.status ?? "Draft";
      if (prev === newStatus) return;
      const nextHistory = [
        ...(record.statusHistory ?? []),
        {
          id: `hist-${Date.now()}`,
          previousStatus: prev,
          newStatus,
          changeDate: new Date().toISOString(),
        },
      ];
      updateRecord({ status: newStatus, statusHistory: nextHistory });
    },
    [record.status, record.statusHistory, updateRecord]
  );

  const focalLabel = record.problemStatementDetails?.focalPoint?.trim() ||
    record.nodes?.[0]?.data?.label ||
    "Enter the focus of this investigation...";
  const displayRcaId = record.rcaId ?? record.id;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header: RCA ID, title, status, asset/dept, focal point, back */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 border-b bg-white shrink-0">
        <div className="flex flex-wrap items-baseline gap-3">
          <Text variant="h6" className="text-gray-900">
            {record.title}
          </Text>
          <span className="text-sm text-gray-500 font-mono">{displayRcaId}</span>
          {(record.assetName || record.departmentName) && (
            <span className="text-sm text-gray-500">
              {[record.assetName, record.departmentName].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={record.status ?? "Draft"}
            onValueChange={(v) => changeStatus(v as RcaStatus)}
          >
            <SelectTrigger className="w-[160px]" label="">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RCA_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href={ROUTES.RCA}>
            <Button variant="ghost" size="small">
              Back to list
            </Button>
          </Link>
        </div>
      </div>
      <div className="px-3 pb-2 text-sm text-gray-600">
        Focal Point: {focalLabel}
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 transition
              ${activeTab === tab.id
                ? "border-green-600 text-green-700 bg-white -mb-px"
                : "border-transparent text-gray-600 hover:text-gray-900"}
            `}
          >
            {tab.label}
            {tab.id === "analysis" && (
              <span className="ml-1 inline-block w-4 h-4 text-gray-400">▾</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`flex-1 min-h-0 flex flex-col ${activeTab === "analysis" ? "overflow-hidden" : "overflow-auto"}`}>
        {activeTab === "evidence" && (
          <RcaTabEvidence
            evidence={record.evidence ?? []}
            onChange={(evidence) => updateRecord({ evidence })}
          />
        )}
        {activeTab === "problem-statement" && (
          <RcaTabProblemStatement
            data={record.problemStatementDetails}
            onChange={(problemStatementDetails) =>
              updateRecord({ problemStatementDetails })
            }
          />
        )}
        {activeTab === "analysis" && (
          <div className="flex-1 min-h-0 flex flex-col">
            <RcaTabAnalysis
              record={record}
              onRecordChange={updateRecord}
            />
          </div>
        )}
        {activeTab === "solutions" && (
          <RcaTabSolutions
            actions={record.actions ?? []}
            onChange={(actions) => updateRecord({ actions })}
          />
        )}
        {activeTab === "final-report" && (
          <RcaTabFinalReport
            data={record.finalReport}
            onChange={(finalReport) => updateRecord({ finalReport })}
          />
        )}
      </div>
    </div>
  );
}
