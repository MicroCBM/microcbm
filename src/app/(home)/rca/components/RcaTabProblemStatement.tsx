"use client";

import React from "react";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/Select";
import type { RcaProblemStatement } from "@/types";

interface RcaTabProblemStatementProps {
  data: RcaProblemStatement | undefined;
  onChange: (data: RcaProblemStatement) => void;
}

const IMPACT_CATEGORIES = ["Personnel Health", "Environmental", "Asset", "Production", "Reputation"];
const IMPACT_COST_LEVELS = ["Low", "Medium", "High"] as const;
type ImpactCostLevel = (typeof IMPACT_COST_LEVELS)[number];

export function RcaTabProblemStatement({ data, onChange }: RcaTabProblemStatementProps) {
  const d = data ?? {};

  const update = (updates: Partial<RcaProblemStatement>) => {
    onChange({ ...d, ...updates });
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl">
      <Text variant="h6">Problem Statement</Text>

      <Input
        label="Problem"
        placeholder="Enter the problem for this investigation..."
        value={d.focalPoint ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ focalPoint: e.target.value })}
      />

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          When
        </Text>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={d.startDate ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={d.endDate ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ endDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          Where
        </Text>
        <div className="flex flex-col gap-3">
          <Input
            label="Location"
            placeholder="Enter an address or general location"
            value={d.mapLocation ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ mapLocation: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select value={d.businessUnit ?? ""} onValueChange={(v) => update({ businessUnit: v })}>
              <SelectTrigger label="Organization">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ops">Operations</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={d.location ?? ""} onValueChange={(v) => update({ location: v })}>
              <SelectTrigger label="Site">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="site-a">Site A</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={d.productClass ?? ""} onValueChange={(v) => update({ productClass: v })}>
              <SelectTrigger label="Asset">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class-1">Class 1</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={d.resourceType ?? ""} onValueChange={(v) => update({ resourceType: v })}>
              <SelectTrigger label="Asset tag number">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          Actual Impact
        </Text>
        <div className="space-y-2">
          {IMPACT_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="w-28 text-sm text-gray-600">{cat}</span>
              <Input
                placeholder="Description"
                className="flex-1"
                value={
                  (d.actualImpact ?? []).find((i) => i.category === cat)?.description ?? ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const current = d.actualImpact ?? [];
                  const existing = current.find((i) => i.category === cat);
                  const rest = current.filter((i) => i.category !== cat);
                  update({
                    actualImpact: [
                      ...rest,
                      { category: cat, description: e.target.value, cost: existing?.cost },
                    ],
                  });
                }}
              />
              <Select
                value={(d.actualImpact ?? []).find((i) => i.category === cat)?.cost ?? ""}
                onValueChange={(v) => {
                  const current = d.actualImpact ?? [];
                  const existing = current.find((i) => i.category === cat);
                  const rest = current.filter((i) => i.category !== cat);
                  update({
                    actualImpact: [...rest, { category: cat, description: existing?.description, cost: v as ImpactCostLevel }],
                  });
                }}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Cost" />
                </SelectTrigger>
                <SelectContent>
                  {IMPACT_COST_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Input
            label="Investigation Costs"
            placeholder="Describe the costs of the investigation"
            value={d.investigationCosts ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              update({ investigationCosts: e.target.value })
            }
          />
          <span className="text-sm text-gray-500 mt-6">Actual Impact Total: ${d.actualImpactTotal ?? "0.00"}</span>
        </div>
      </div>

      <div>
        <Text variant="p" className="font-medium text-gray-700 mb-2">
          Potential Impact
        </Text>
        <div className="space-y-2">
          {IMPACT_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="w-28 text-sm text-gray-600">{cat}</span>
              <Input
                placeholder="Description"
                className="flex-1"
                value={
                  (d.potentialImpact ?? []).find((i) => i.category === cat)?.description ?? ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const current = d.potentialImpact ?? [];
                  const existing = current.find((i) => i.category === cat);
                  const rest = current.filter((i) => i.category !== cat);
                  update({
                    potentialImpact: [
                      ...rest,
                      { category: cat, description: e.target.value, cost: existing?.cost },
                    ],
                  });
                }}
              />
              <Select
                value={(d.potentialImpact ?? []).find((i) => i.category === cat)?.cost ?? ""}
                onValueChange={(v) => {
                  const current = d.potentialImpact ?? [];
                  const existing = current.find((i) => i.category === cat);
                  const rest = current.filter((i) => i.category !== cat);
                  update({
                    potentialImpact: [...rest, { category: cat, description: existing?.description, cost: v as ImpactCostLevel }],
                  });
                }}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Cost" />
                </SelectTrigger>
                <SelectContent>
                  {IMPACT_COST_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-500">Potential Impact Total: ${d.potentialImpactTotal ?? "0.00"}</span>
      </div>

      <div className="flex gap-4 items-end">
        <Input
          label="Frequency"
          placeholder="e.g. 3"
          value={d.frequency ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            update({ frequency: e.target.value })
          }
        />
        <span className="text-sm text-gray-600">times</span>
        <Select value={d.frequencyUnit ?? ""} onValueChange={(v) => update({ frequencyUnit: v })}>
          <SelectTrigger label="Per">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Per day</SelectItem>
            <SelectItem value="week">Per week</SelectItem>
            <SelectItem value="month">Per month</SelectItem>
            <SelectItem value="year">Per year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input
        label="Frequency Notes"
        type="textarea"
        rows={2}
        value={d.frequencyNotes ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
          update({ frequencyNotes: e.target.value })
        }
      />
    </div>
  );
}
