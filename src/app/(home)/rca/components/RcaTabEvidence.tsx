"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { postRcaEvidenceService, deleteRcaEvidenceService } from "@/app/actions/rcas";
import { uploadImage } from "@/app/actions/image-upload";
import { usePresignedUrl } from "@/hooks";
import type { RcaEvidenceItem } from "@/types";
import { isEvidenceDataUrl } from "@/types/rca";
import { toast } from "sonner";

/** Renders an image from a storage file key using presigned URL (same pattern as ViewSiteModal / ViewSamplingPointModal). */
function EvidenceAttachmentImage({
  fileKey,
  alt,
  className,
}: {
  fileKey: string;
  alt?: string;
  className?: string;
}) {
  const { url, isLoading } = usePresignedUrl(fileKey, !!fileKey);
  if (!url && !isLoading) return null;
  if (isLoading) {
    return (
      <span className={className} style={{ width: 40, height: 40 }} aria-hidden>
        <span className="text-gray-400 text-xs">…</span>
      </span>
    );
  }
  return (
    <Image
      src={url!}
      alt={alt ?? ""}
      width={40}
      height={40}
      unoptimized
      className={className ?? "w-10 h-10 object-cover rounded border border-gray-200"}
    />
  );
}

const ACCEPT = "image/*,.pdf,.doc,.docx";
const MAX_FILE_MB = 10;
const EVIDENCE_UPLOAD_FOLDER = "rca-evidence";

/** Show as observation (image + label) when type is observation or when attachments contain a file key or data URL. */
function hasObservationAttachment(item: RcaEvidenceItem): boolean {
  if ((item.type ?? "text") === "observation") return true;
  const first = item.attachments?.[0];
  return typeof first === "string" && first.length > 0;
}

/** Fallback label when API returns no text/fileName (e.g. "rca-evidence/xxx.webp" → "Attachment"). */
function evidenceLabelFromFileKey(fileKey: string | undefined): string {
  if (!fileKey) return "";
  const name = fileKey.split("/").pop() ?? fileKey;
  return name.length > 20 ? `${name.slice(0, 17)}…` : name;
}

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
  /** RCA id for POST rcas/:id/evidence */
  rcaId?: string;
}

export function RcaTabEvidence({ evidence, onChange, rcaId }: RcaTabEvidenceProps) {
  const [inputValue, setInputValue] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [addingText, setAddingText] = useState(false);
  const [addingObservation, setAddingObservation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        const text = inputValue.trim();
        const newItem: RcaEvidenceItem = {
          id: `ev-${Date.now()}`,
          text,
          type: "text",
        };

        if (rcaId) {
          setAddingText(true);
          const payload = {
            description: text,
            attachments: [] as string[],
            evidence_type: "Other" as const,
          };
          console.log("POST rcas/:id/evidence (text) request:", { rcaId, payload });
          postRcaEvidenceService(rcaId, payload)
            .then((res) => {
              if (res.success && res.data) {
                const body = res.data as { data?: { id?: string } };
                const id = body?.data?.id ?? newItem.id;
                onChange([...(evidence ?? []), { ...newItem, id }]);
                setInputValue("");
              } else {
                console.log("POST rcas/:id/evidence (text) response:", res);
                toast.error(res.message ?? "Failed to add evidence.");
                onChange([...(evidence ?? []), newItem]);
                setInputValue("");
              }
            })
            .finally(() => setAddingText(false));
        } else {
          onChange([...(evidence ?? []), newItem]);
          setInputValue("");
        }
      }
    },
    [inputValue, evidence, onChange, rcaId]
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

        if (rcaId) {
          setAddingObservation(true);
          // 1. Upload file to get file_key (same pattern as sites/assets/samples)
          const uploadRes = await uploadImage({ file }, EVIDENCE_UPLOAD_FOLDER);
          if (!uploadRes.success) {
            setAddingObservation(false);
            console.log("RCA evidence file upload response:", uploadRes);
            toast.error(uploadRes.message ?? "File upload failed.");
            return;
          }
          const fileKey = (uploadRes.data as { data?: { file_key?: string } })?.data?.file_key;
          if (!fileKey) {
            setAddingObservation(false);
            toast.error("No file key returned from upload.");
            return;
          }
          // 2. Create evidence with backend file key in attachments
          const payload = {
            description: file.name,
            attachments: [fileKey],
            evidence_type: "Inspection Photo" as const,
          };
          console.log("POST rcas/:id/evidence (observation) request:", { rcaId, payload });
          postRcaEvidenceService(rcaId, payload)
            .then((res) => {
              console.log("POST rcas/:id/evidence (observation) response:", res);
              if (res.success && res.data) {
                const body = res.data as { data?: { id?: string } };
                const id = body?.data?.id ?? newItem.id;
                onChange([...(evidence ?? []), { ...newItem, id }]);
              } else {
                console.log("POST rcas/:id/evidence (observation) response:", res);
                toast.error(res.message ?? "Failed to add observation.");
                onChange([...(evidence ?? []), newItem]);
              }
            })
            .finally(() => setAddingObservation(false));
        } else {
          onChange([...(evidence ?? []), newItem]);
        }
      } catch (err) {
        setUploadError("Could not read file");
        setAddingObservation(false);
        console.error("RCA evidence addObservation error:", err);
      }
    },
    [evidence, onChange, rcaId]
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
      const nextList = (evidence ?? []).filter((item) => item.id !== id);
      if (rcaId) {
        deleteRcaEvidenceService(rcaId, id)
          .then((res) => {
            if (res.success) {
              onChange(nextList);
              toast.success("Evidence removed.");
            } else {
              toast.error(res.message ?? "Failed to delete evidence.");
            }
          })
          .catch(() => {
            toast.error("Failed to delete evidence.");
          });
      } else {
        onChange(nextList);
      }
    },
    [evidence, onChange, rcaId]
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
        disabled={addingText}
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
          onClick={() => !addingObservation && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${addingObservation ? "opacity-60 pointer-events-none" : ""}
            ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400 bg-gray-50/50"}
          `}
        >
          <p className="text-sm text-gray-600">
            {addingObservation ? "Uploading…" : "Drag & drop a photo or document here, or click to browse"}
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
                    {hasObservationAttachment(item) ? "OB-" : "EV-"}
                    {String(idx + 1).padStart(4, "0")}
                  </td>
                  <td className="p-3 text-gray-600">
                    {hasObservationAttachment(item) ? "Observation" : "Evidence"}
                  </td>
                  <td className="p-3">
                    {hasObservationAttachment(item) ? (
                      <span className="flex items-center gap-2">
                        {isEvidenceDataUrl(item.attachments?.[0]) ? (
                          <Image
                            src={item.attachments[0]}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized
                            className="w-10 h-10 object-cover rounded border border-gray-200"
                          />
                        ) : item.attachments?.[0] ? (
                          <EvidenceAttachmentImage
                            fileKey={item.attachments[0]}
                            className="w-10 h-10 object-cover rounded border border-gray-200"
                          />
                        ) : null}
                        <span>{item.fileName ?? (item.text || evidenceLabelFromFileKey(item.attachments?.[0]))}</span>
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
