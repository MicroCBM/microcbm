"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@/components";
import Input from "@/components/input/Input";
import { Button } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/Select";
import {
  postRcaProblemStatementImpactService,
  postRcaProblemStatementService,
} from "@/app/actions/rcas";
import {
  getOrganizationsService,
  getSitesService,
  getAssetsService,
} from "@/app/actions";
import type { RcaProblemStatement } from "@/types";
import type { Organization, Asset, Sites } from "@/types";
import { toast } from "sonner";

interface RcaTabProblemStatementProps {
  data: RcaProblemStatement | undefined;
  onChange: (data: RcaProblemStatement) => void;
  /** RCA id for POST problem-statements and impacts */
  rcaId?: string;
  /** Problem statement id (required for impacts API) */
  problemStatementId?: string;
  /** Called when a problem statement is created and we have the backend id (for impacts) */
  onProblemStatementCreated?: (psId: string) => void;
  /** When set (e.g. from Create RCA), Organization is shown and disabled */
  lockedOrganizationId?: string;
  /** When set (e.g. from Create RCA), Asset tag number is shown and disabled */
  lockedAssetTag?: string;
  /** When set (e.g. from API), Asset dropdown is shown and disabled */
  lockedAssetId?: string;
}

const IMPACT_CATEGORIES = ["Personnel Health", "Environmental", "Asset", "Production", "Reputation"];
const IMPACT_COST_LEVELS = ["Low", "Medium", "High"] as const;
type ImpactCostLevel = (typeof IMPACT_COST_LEVELS)[number];

/** Map UI category to API impact kind (Actual). Accepted: ASafety|AEnvironmental|ACost|ARevenue|ACustomerService|AInvestigationCosts */
const CATEGORY_TO_KIND_ACTUAL: Record<string, string> = {
  "Personnel Health": "ASafety",
  Environmental: "AEnvironmental",
  Asset: "ACost",
  Production: "ARevenue",
  Reputation: "ACustomerService",
};

/** Map UI category to API impact kind (Potential). Accepted: PSafety|PEnvironmental|PCost|PRevenue|PCustomerService */
const CATEGORY_TO_KIND_POTENTIAL: Record<string, string> = {
  "Personnel Health": "PSafety",
  Environmental: "PEnvironmental",
  Asset: "PCost",
  Production: "PRevenue",
  Reputation: "PCustomerService",
};

export function RcaTabProblemStatement({
  data,
  onChange,
  rcaId,
  problemStatementId,
  onProblemStatementCreated,
  lockedOrganizationId,
  lockedAssetTag,
  lockedAssetId,
}: RcaTabProblemStatementProps) {
  const d = data ?? {};
  const [saving, setSaving] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sites, setSites] = useState<Sites[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingWhere, setLoadingWhere] = useState(true);

  useEffect(() => {
    const fetchWhereOptions = async () => {
      setLoadingWhere(true);
      try {
        const [orgRes, sitesRes, assetsRes] = await Promise.all([
          getOrganizationsService({ page: 1, limit: 100 }),
          getSitesService({ page: 1, limit: 100 }),
          getAssetsService({ page: 1, limit: 200 }),
        ]);
        setOrganizations(orgRes.data ?? []);
        setSites(sitesRes.data ?? []);
        setAssets(assetsRes.data ?? []);
      } catch {
        toast.error("Failed to load organizations, sites, or assets.");
      } finally {
        setLoadingWhere(false);
      }
    };
    fetchWhereOptions();
  }, []);

  const hasLockedOrg = lockedOrganizationId != null && lockedOrganizationId !== "";
  const hasLockedAsset = (lockedAssetId != null && lockedAssetId !== "") || (lockedAssetTag != null && lockedAssetTag !== "");
  const sitesForOrg = (lockedOrganizationId ?? d.businessUnit)
    ? sites.filter((s) => s.organization?.id === (lockedOrganizationId ?? d.businessUnit))
    : sites;
  const assetsForSite = d.location
    ? assets.filter((a) => a.parent_site?.id === d.location)
    : assets;

  const update = useCallback(
    (updates: Partial<RcaProblemStatement>) => {
      onChange({ ...d, ...updates });
    },
    [d, onChange]
  );

  const postImpact = useCallback(
    (category: string, description: string, cost?: string, isPotential = false) => {
      if (!rcaId || !problemStatementId || !description.trim()) return;
      const kindMap = isPotential ? CATEGORY_TO_KIND_POTENTIAL : CATEGORY_TO_KIND_ACTUAL;
      const kind = kindMap[category] ?? (isPotential ? "PSafety" : "ASafety");
      postRcaProblemStatementImpactService(rcaId, problemStatementId, {
        kind,
        description: description.trim(),
        amount: cost ?? "0",
      }).then((res) => {
        if (!res.success) toast.error(res.message ?? "Failed to save impact.");
      });
    },
    [rcaId, problemStatementId]
  );

  const saveProblemStatement = useCallback(() => {
    if (!rcaId) return;
    const focalPoint = (d.focalPoint ?? "").trim();
    if (!focalPoint) {
      toast.error("Enter a problem (focal point) before saving.");
      return;
    }
    setSaving(true);
    postRcaProblemStatementService(rcaId, {
      focal_point: focalPoint,
      start_date: d.startDate ?? "",
      end_date: d.endDate ?? "",
      unique_timing: d.uniqueTiming,
      business_unit: lockedOrganizationId ?? d.businessUnit ?? "",
      location: d.location ?? "",
      product_class: d.productClass ?? "",
      resource_type: lockedAssetTag ?? d.resourceType ?? "",
      frequency_count: d.frequency ?? "",
      frequency_schedule: d.frequencyUnit ?? "",
      frequency_notes: d.frequencyNotes ?? "",
    })
      .then((res) => {
        if (res.success && res.data) {
          const body = res.data as { data?: { id?: string } };
          const id = body?.data?.id;
          if (id) {
            onProblemStatementCreated?.(id);
            // Post each actual and potential impact one by one (POST rcas/:id/problem-statements/:psId/impacts)
            (d.actualImpact ?? []).forEach((item) => {
              if (item.description?.trim()) {
                postRcaProblemStatementImpactService(rcaId!, id, {
                  kind: CATEGORY_TO_KIND_ACTUAL[item.category] ?? "ASafety",
                  description: item.description.trim(),
                  amount: item.cost ?? "0",
                }).then((r) => { if (!r.success) toast.error(r.message ?? "Failed to save impact."); });
              }
            });
            (d.potentialImpact ?? []).forEach((item) => {
              if (item.description?.trim()) {
                postRcaProblemStatementImpactService(rcaId!, id, {
                  kind: CATEGORY_TO_KIND_POTENTIAL[item.category] ?? "PSafety",
                  description: item.description.trim(),
                  amount: item.cost ?? "0",
                }).then((r) => { if (!r.success) toast.error(r.message ?? "Failed to save impact."); });
              }
            });
          }
          toast.success("Problem statement saved.");
        } else {
          toast.error(res.message ?? "Failed to save problem statement.");
        }
      })
      .finally(() => setSaving(false));
  }, [rcaId, d, onProblemStatementCreated, lockedOrganizationId, lockedAssetTag]);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <Text variant="h6">Problem Statement</Text>
        {rcaId && (
          <Button
            type="button"
            variant="primary"
            size="small"
            onClick={saveProblemStatement}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save problem statement"}
          </Button>
        )}
      </div>

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
            {hasLockedOrg ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Organization</label>
                <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                  {organizations.find((o) => o.id === lockedOrganizationId)?.name ?? lockedOrganizationId}
                </div>
              </div>
            ) : (
              <Select
                value={d.businessUnit ?? ""}
                onValueChange={(v) => update({ businessUnit: v, location: undefined, productClass: undefined, resourceType: undefined })}
              >
                <SelectTrigger label="Organization">
                  <SelectValue placeholder={loadingWhere ? "Loading…" : "Choose"} />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select
              value={d.location ?? ""}
              onValueChange={(v) => update({ location: v, productClass: undefined, resourceType: undefined })}
            >
              <SelectTrigger label="Site">
                <SelectValue placeholder={loadingWhere ? "Loading…" : "Choose"} />
              </SelectTrigger>
              <SelectContent>
                {sitesForOrg.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasLockedAsset && lockedAssetId ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Asset</label>
                <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                  {assets.find((a) => a.id === lockedAssetId)?.name || assets.find((a) => a.id === lockedAssetId)?.tag || lockedAssetId}
                </div>
              </div>
            ) : (
              <Select
                value={d.productClass ?? ""}
                onValueChange={(v) => {
                  const asset = assets.find((a) => a.id === v);
                  update({ productClass: v, resourceType: asset?.tag ?? undefined });
                }}
              >
                <SelectTrigger label="Asset">
                  <SelectValue placeholder={loadingWhere ? "Loading…" : "Choose"} />
                </SelectTrigger>
                <SelectContent>
                  {assetsForSite.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {hasLockedAsset ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Asset tag number</label>
                <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                  {lockedAssetTag ?? (lockedAssetId ? assets.find((a) => a.id === lockedAssetId)?.tag : null) ?? "—"}
                </div>
              </div>
            ) : (
              <Select
                value={d.productClass ?? ""}
                onValueChange={(v) => {
                  const asset = assets.find((a) => a.id === v);
                  update({ productClass: v, resourceType: asset?.tag ?? undefined });
                }}
              >
                <SelectTrigger label="Asset tag number">
                  <SelectValue placeholder={loadingWhere ? "Loading…" : "Choose"} />
                </SelectTrigger>
                <SelectContent>
                  {assetsForSite.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const desc = (d.actualImpact ?? []).find((i) => i.category === cat);
                  postImpact(cat, e.target.value.trim(), desc?.cost);
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
                  postImpact(cat, existing?.description ?? "", v);
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
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const desc = (d.potentialImpact ?? []).find((i) => i.category === cat);
                  postImpact(cat, e.target.value.trim(), desc?.cost, true);
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
                  postImpact(cat, existing?.description ?? "", v, true);
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
          <SelectTrigger label="Frequency">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
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
