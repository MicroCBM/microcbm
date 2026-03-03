"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import type { RcaEvidenceItem } from "@/types";

const ACCEPT = "image/*,.pdf,.doc,.docx";
const MAX_FILE_MB = 10;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface RcaTabEvidenceProps {
  evidence: RcaEvidenceItem[];
  onChange: (evidence: RcaEvidenceItem[]) => void;
}

export function RcaTabEvidence({ evidence, onChange }: RcaTabEvidenceProps) {
  const [inputValue, setInputValue] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        const newItem: RcaEvidenceItem = {
          id: `ev-${Date.now()}`,
          text: inputValue.trim(),
          type: "text",
        };
        onChange([...(evidence ?? []), newItem]);
        setInputValue("");
      }
    },
    [inputValue, evidence, onChange]
  );

  const addObservation = useCallback(
    async (file: File) => {
      setUploadError(null);
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setUploadError(`File must be under ${MAX_FILE_MB} MB`);
        return;
      }
      try {
        const dataUrl = await fileToDataUrl(file);
        const newItem: RcaEvidenceItem = {
          id: `obs-${Date.now()}`,
          text: file.name,
          type: "observation",
          fileName: file.name,
          attachments: [dataUrl],
        };
        onChange([...(evidence ?? []), newItem]);
      } catch {
        setUploadError("Could not read file");
      }
    },
    [evidence, onChange]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      addObservation(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [addObservation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

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

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          Observation (photo or initial report)
        </Text>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400 bg-gray-50/50"}
          `}
        >
          <p className="text-sm text-gray-600">
            Drag & drop a photo or document here, or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Images, PDF, Word. Max {MAX_FILE_MB} MB
          </p>
          {uploadError && (
            <p className="text-sm text-red-600 mt-2">{uploadError}</p>
          )}
        </div>
      </div>

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
                <th className="text-left p-3 font-medium text-gray-700 w-24">Type</th>
                <th className="text-left p-3 font-medium text-gray-700">Evidence / Observation</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-600">
                    {(item.type ?? "text") === "observation" ? "OB-" : "EV-"}
                    {String(idx + 1).padStart(4, "0")}
                  </td>
                  <td className="p-3 text-gray-600">
                    {(item.type ?? "text") === "observation" ? "Observation" : "Evidence"}
                  </td>
                  <td className="p-3">
                    {item.type === "observation" ? (
                      <span className="flex items-center gap-2">
                        {item.attachments?.[0]?.startsWith("data:image/") && (
                          <Image
                            src={item.attachments[0]}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized
                            className="w-10 h-10 object-cover rounded border border-gray-200"
                          />
                        )}
                        <span>{item.fileName ?? item.text}</span>
                      </span>
                    ) : (
                      item.text
                    )}
                  </td>
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
    </div>
  );
}
