"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { FishboneDiagram } from "./FishboneDiagram";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { Button } from "@/components";
import { postRcaFishBoneService } from "@/app/actions/rcas";
import type { RcaFishboneEntry, RcaFishboneCategory } from "@/types";
import { FISHBONE_CATEGORIES } from "../lib/rca-constants";
import { toast } from "sonner";
import { ComponentGuard } from "@/components/content-guard";

const LOCAL_ID_PREFIX = "fb-";

function isLocalId(id: string): boolean {
  return id.startsWith(LOCAL_ID_PREFIX);
}

interface RcaTabFishboneProps {
  entries: RcaFishboneEntry[];
  onChange: (entries: RcaFishboneEntry[]) => void;
  /** Problem/focus label for the diagram root (e.g. from Problem Statement) */
  problemLabel?: string;
  /** RCA id for POST rcas/fish-bones when saving (optional) */
  rcaId?: string;
}

export function RcaTabFishbone({ entries, onChange, problemLabel, rcaId }: RcaTabFishboneProps) {
  const [saving, setSaving] = useState(false);
  /** Ref to always read latest entries when Save runs (avoids stale closure after typing). */
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  const byCategory = FISHBONE_CATEGORIES.map((cat) => ({
    category: cat,
    items: entries.filter((e) => e.category === cat),
  }));

  const diagramData = useMemo(() => {
    return FISHBONE_CATEGORIES.map((cat) => {
      const categoryEntries = entries.filter((e) => e.category === cat);
      return {
        category: cat,
        causes:
          categoryEntries.length > 0
            ? categoryEntries.map(
                (e) =>
                  (e.causeDescription?.trim() || "(No description)") +
                  (e.evidence?.trim() ? " — " + e.evidence.trim() : "")
              )
            : [],
      };
    });
  }, [entries]);

  const unsavedCount = useMemo(() => entries.filter((e) => isLocalId(e.id)).length, [entries]);

  const addEntry = useCallback(
    (category: RcaFishboneCategory) => {
      const newEntry: RcaFishboneEntry = {
        id: `${LOCAL_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}`,
        category,
        causeDescription: "",
        evidence: "",
      };
      onChange([...entries, newEntry]);
    },
    [entries, onChange]
  );

  const handleSave = useCallback(() => {
    const latestEntries = entriesRef.current;
    console.log("[Fishbone Save] handleSave called, rcaId:", rcaId, "entries:", latestEntries.length);
    if (!rcaId) {
      console.log("[Fishbone Save] No rcaId — endpoint not run.");
      toast.info("Save the RCA first, then add and save causes here.");
      return;
    }
    const toSync = latestEntries.filter((e) => isLocalId(e.id));
    console.log("[Fishbone Save] toSync (unsaved) count:", toSync.length, "entries:", toSync.map((e) => ({ id: e.id, cause: e.causeDescription, evidence: e.evidence })));
    if (toSync.length === 0) {
      console.log("[Fishbone Save] No unsaved causes — endpoint not run.");
      toast.success("All causes are already saved.");
      return;
    }
    setSaving(true);
    let updatedEntries = [...latestEntries];
    let index = 0;
    const postNext = () => {
      if (index >= toSync.length) {
        setSaving(false);
        onChange(updatedEntries);
        toast.success("Fishbone causes saved.");
        return;
      }
      const entry = toSync[index];
      const payload = {
        rca_id: rcaId,
        cause: entry.causeDescription?.trim() ?? "",
        evidence: entry.evidence?.trim() ?? "",
        category: entry.category,
        is_root_cause: false,
      };
      console.log("[Fishbone Save] POST payload (" + (index + 1) + "/" + toSync.length + "):", payload);
      postRcaFishBoneService(payload)
        .then((res) => {
          console.log("[Fishbone Save] POST response:", res);
          if (res.success && res.data) {
            const body = res.data as { data?: { id?: string } };
            const backendId = body?.data?.id ?? entry.id;
            updatedEntries = updatedEntries.map((e) =>
              e.id === entry.id ? { ...e, id: backendId } : e
            );
          } else {
            toast.error(res.message ?? "Failed to save cause.");
          }
          index += 1;
          postNext();
        })
        .catch(() => {
          console.log("[Fishbone Save] POST error");
          toast.error("Failed to save causes.");
          index += 1;
          postNext();
        });
    };
    postNext();
  }, [onChange, rcaId]);

  const updateEntry = useCallback(
    (id: string, updates: Partial<RcaFishboneEntry>) => {
      onChange(
        entries.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    [entries, onChange]
  );

  const removeEntry = useCallback(
    (id: string) => onChange(entries.filter((e) => e.id !== id)),
    [entries, onChange]
  );

  return (
    <div className="p-4 flex flex-col gap-6">
      <Text variant="h6">Fishbone (Ishikawa) – 6M</Text>
      <p className="text-sm text-gray-600">
        Add causes by category. Click Save to sync cause and evidence to the server.
      </p>

      <div className="flex items-center gap-2">
        <ComponentGuard permissions="rcas:update" unauthorizedFallback={null}>
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={handleSave}
          disabled={saving || !rcaId || unsavedCount === 0}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
        </ComponentGuard>
        {unsavedCount > 0 && (
          <span className="text-sm text-gray-500">{unsavedCount} unsaved cause(s)</span>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white h-[420px] w-full flex items-center justify-center p-4">
        <FishboneDiagram
          problemLabel={problemLabel || "Problem"}
          categories={diagramData}
          className="max-w-full"
        />
      </div>

      <div className="space-y-4">
        <Text variant="p" className="font-medium text-gray-800">
          Add or edit causes
        </Text>
        {byCategory.map(({ category, items }) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Text variant="p" className="font-medium text-gray-800">
                {category}
              </Text>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => addEntry(category)}
              >
                + Add cause
              </Button>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">No causes yet.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((entry) => (
                  <li key={entry.id} className="flex flex-col gap-1 p-2 bg-gray-50 rounded">
                    <div className="flex gap-2 items-start">
                      <Input
                        placeholder="Cause description"
                        value={entry.causeDescription}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateEntry(entry.id, { causeDescription: e.target.value })
                        }
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        className="text-red-600 hover:underline text-xs shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      placeholder="Evidence (optional)"
                      value={entry.evidence ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEntry(entry.id, { evidence: e.target.value })
                      }
                      className="text-sm"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
