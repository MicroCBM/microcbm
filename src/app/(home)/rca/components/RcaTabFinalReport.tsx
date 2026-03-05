"use client";

import React from "react";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { Button } from "@/components";
import type { RcaFinalReport } from "@/types";

interface RcaTabFinalReportProps {
  data: RcaFinalReport | undefined;
  onChange: (data: RcaFinalReport) => void;
  /** Called when user clicks Submit to persist summaries (e.g. to API) */
  onSubmit?: (data: RcaFinalReport) => void;
}

export function RcaTabFinalReport({ data, onChange, onSubmit }: RcaTabFinalReportProps) {
  const d = data ?? {};

  const update = (updates: Partial<RcaFinalReport>) => {
    onChange({ ...d, ...updates });
  };

  const handleSubmit = () => {
    const payload: RcaFinalReport = {
      executiveSummary: d.executiveSummary ?? "",
      causeAndEffectSummary: d.causeAndEffectSummary ?? "",
    };
    onChange(payload);
    onSubmit?.(payload);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <Text variant="h6">Final Report</Text>
        <div className="flex gap-2">
          <Button variant="outline" size="small" type="button">
            Create PDF
          </Button>
          <Button variant="outline" size="small" type="button">
            Create Word Doc
          </Button>
          <Button variant="primary" size="small" type="button" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          Executive Summary
        </Text>
        <Input
          type="textarea"
          rows={8}
          placeholder="Summarize the investigation and key findings..."
          value={d.executiveSummary ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
            update({ executiveSummary: e.target.value })
          }
          className="w-full"
        />
      </div>

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          Cause and Effect Summary
        </Text>
        <Input
          type="textarea"
          rows={10}
          placeholder="Summarize the cause-and-effect analysis..."
          value={d.causeAndEffectSummary ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
            update({ causeAndEffectSummary: e.target.value })
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
