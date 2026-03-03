"use client";

import React from "react";
import { Text } from "@/components";
import { RcaChart } from "./RcaChart";
import { RcaTabFishbone } from "./RcaTabFishbone";
import type { RcaRecord } from "@/types";

interface RcaTabAnalysisProps {
  record: RcaRecord;
  onRecordChange: (record: RcaRecord) => void;
}

export function RcaTabAnalysis({ record, onRecordChange }: RcaTabAnalysisProps) {
  const template = record.template === "fishbone" || record.template === "logic-tree" || record.template === "5whys"
    ? record.template
    : "5whys";

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
            hideHeader
          />
        )}
        {template === "fishbone" && (
          <RcaTabFishbone
            entries={record.fishboneEntries ?? []}
            problemLabel={record.problemStatementDetails?.focalPoint ?? record.title ?? "Problem"}
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
