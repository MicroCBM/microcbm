"use client";

import React, { useCallback } from "react";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { Button } from "@/components";
import type { RcaFishboneEntry, RcaFishboneCategory } from "@/types";
import { FISHBONE_CATEGORIES } from "../lib/rca-constants";

interface RcaTabFishboneProps {
  entries: RcaFishboneEntry[];
  onChange: (entries: RcaFishboneEntry[]) => void;
}

export function RcaTabFishbone({ entries, onChange }: RcaTabFishboneProps) {
  const byCategory = FISHBONE_CATEGORIES.map((cat) => ({
    category: cat,
    items: entries.filter((e) => e.category === cat),
  }));

  const addEntry = useCallback(
    (category: RcaFishboneCategory) => {
      const newEntry: RcaFishboneEntry = {
        id: `fb-${Date.now()}`,
        category,
        causeDescription: "",
        evidence: "",
      };
      onChange([...entries, newEntry]);
    },
    [entries, onChange]
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
        Add causes by category: Man, Machine, Method, Material, Measurement, Environment.
      </p>
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
  );
}
