"use client";

import React, { useCallback, useMemo, useState } from "react";
import { FishboneDiagram } from "./FishboneDiagram";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { Button } from "@/components";
import { postRcaFishBoneService } from "@/app/actions/rcas";
import type { RcaFishboneEntry, RcaFishboneCategory } from "@/types";
import { FISHBONE_CATEGORIES } from "../lib/rca-constants";
import { toast } from "sonner";

interface RcaTabFishboneProps {
  entries: RcaFishboneEntry[];
  onChange: (entries: RcaFishboneEntry[]) => void;
  /** Problem/focus label for the diagram root (e.g. from Problem Statement) */
  problemLabel?: string;
  /** RCA id for POST rcas/fish-bones (optional; when set, new causes are created via API) */
  rcaId?: string;
}

export function RcaTabFishbone({ entries, onChange, problemLabel, rcaId }: RcaTabFishboneProps) {
  const [addingCategory, setAddingCategory] = useState<RcaFishboneCategory | null>(null);
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

  const addEntry = useCallback(
    (category: RcaFishboneCategory) => {
      if (rcaId) {
        setAddingCategory(category);
        postRcaFishBoneService({
          rca_id: rcaId,
          cause: "",
          evidence: "",
          category,
          is_root_cause: false,
        }).then((res) => {
          setAddingCategory(null);
          if (res.success && res.data) {
            const body = res.data as { data?: { id?: string } };
            const id = body?.data?.id ?? `fb-${Date.now()}`;
            const newEntry: RcaFishboneEntry = {
              id,
              category,
              causeDescription: "",
              evidence: "",
            };
            onChange([...entries, newEntry]);
          } else {
            toast.error(res.message ?? "Failed to add cause.");
            const newEntry: RcaFishboneEntry = {
              id: `fb-${Date.now()}`,
              category,
              causeDescription: "",
              evidence: "",
            };
            onChange([...entries, newEntry]);
          }
        });
      } else {
        const newEntry: RcaFishboneEntry = {
          id: `fb-${Date.now()}`,
          category,
          causeDescription: "",
          evidence: "",
        };
        onChange([...entries, newEntry]);
      }
    },
    [entries, onChange, rcaId]
  );

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
        Add causes by category. The diagram updates as you add or edit causes below.
      </p>

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
                disabled={addingCategory === category}
              >
                {addingCategory === category ? "Adding…" : "+ Add cause"}
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
