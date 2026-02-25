"use client";

import React, { useState } from "react";
import { Text } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/Select";
import { RcaChart } from "./RcaChart";
import { RcaTabFishbone } from "./RcaTabFishbone";
import type { RcaRecord } from "@/types";

type AnalysisType = "timeline" | "fishbone" | "cause-effect";

interface RcaTabAnalysisProps {
  record: RcaRecord;
  onRecordChange: (record: RcaRecord) => void;
}

export function RcaTabAnalysis({ record, onRecordChange }: RcaTabAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(
    record.template === "fishbone" ? "fishbone" : "cause-effect"
  );

  const handleSave = (nodes: RcaRecord["nodes"], edges: RcaRecord["edges"]) => {
    onRecordChange({
      ...record,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <Text variant="h6">Analysis</Text>
        <Select
          value={analysisType}
          onValueChange={(v) => setAnalysisType(v as AnalysisType)}
        >
          <SelectTrigger className="w-[220px]" label="">
            <SelectValue placeholder="Select analysis type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timeline">Timeline</SelectItem>
            <SelectItem value="fishbone">Fishbone (6M)</SelectItem>
            <SelectItem value="cause-effect">Cause &amp; Effect Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {analysisType === "cause-effect" && (
          <RcaChart
            initialNodes={record.nodes}
            initialEdges={record.edges}
            onSave={handleSave}
            title={record.title}
            hideHeader
          />
        )}
        {analysisType === "timeline" && (
          <div className="p-8 text-center text-gray-500">
            <Text variant="p">Timeline view — coming soon. Use Cause &amp; Effect Chart for now.</Text>
          </div>
        )}
        {analysisType === "fishbone" && (
          <RcaTabFishbone
            entries={record.fishboneEntries ?? []}
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
