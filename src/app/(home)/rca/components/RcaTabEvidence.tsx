"use client";

import React, { useState, useCallback } from "react";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import type { RcaEvidenceItem } from "@/types";

interface RcaTabEvidenceProps {
  evidence: RcaEvidenceItem[];
  onChange: (evidence: RcaEvidenceItem[]) => void;
}

export function RcaTabEvidence({ evidence, onChange }: RcaTabEvidenceProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        const newItem: RcaEvidenceItem = {
          id: `ev-${Date.now()}`,
          text: inputValue.trim(),
        };
        onChange([...(evidence ?? []), newItem]);
        setInputValue("");
      }
    },
    [inputValue, evidence, onChange]
  );

  const remove = useCallback(
    (id: string) => {
      onChange((evidence ?? []).filter((item) => item.id !== id));
    },
    [evidence, onChange]
  );

  const list = evidence ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      <Text variant="h6">Evidence</Text>
      <Input
        label="Type and hit enter to add evidence"
        placeholder="Type and hit enter to add evidence"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="text-sm text-gray-500 px-3 py-2 border-b bg-gray-50">
          Showing {list.length} of {list.length} records
        </div>
        {list.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No evidence added yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">ID</th>
                <th className="text-left p-3 font-medium text-gray-700">Evidence</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-600">EV-{String(idx + 1).padStart(4, "0")}</td>
                  <td className="p-3">{item.text}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
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
      <p className="text-xs text-gray-500">Attachments: drag & drop or click to browse (placeholder).</p>
    </div>
  );
}
