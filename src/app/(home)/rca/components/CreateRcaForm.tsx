"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Text, Button } from "@/components";
import Input from "@/components/input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/Select";
import { ROUTES } from "@/utils/route-constants";
import { createRcaRecordFromForm, saveRca } from "../lib/rca-storage";
import type { Department, RcaTemplateType } from "@/types";
import type { SessionUser } from "@/types/common";
import { SEVERITY_LEVELS } from "../lib/rca-constants";
import { toast } from "sonner";

const TEMPLATES: { value: RcaTemplateType; label: string; description: string }[] = [
  {
    value: "5whys",
    label: "5 Whys",
    description: "Problem statement and cause chain. Start with the focus of the investigation, then add causes and whys.",
  },
  {
    value: "logic-tree",
    label: "Logic Tree",
    description: "Hierarchical cause-and-effect tree. Map hypotheses with evidence status (Confirmed / Rejected / Pending).",
  },
  {
    value: "fishbone",
    label: "Fishbone (Ishikawa)",
    description: "6M categories (Man, Machine, Method, Material, Measurement, Environment). Identify causes by category.",
  },
];

interface AssetOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

function userDisplayName(u: UserOption): string {
  if (u.first_name || u.last_name) return [u.first_name, u.last_name].filter(Boolean).join(" ");
  return u.email ?? u.id;
}

interface OrganizationOption {
  id: string;
  name: string;
}

interface CreateRcaFormProps {
  assets?: AssetOption[];
  departments?: Department[];
  organizations?: OrganizationOption[];
  users?: UserOption[];
  currentUser?: SessionUser | null;
}

export function CreateRcaForm({
  assets = [],
  departments = [],
  organizations = [],
  users = [],
  currentUser,
}: CreateRcaFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [template, setTemplate] = useState<RcaTemplateType>("5whys");
  const [assetId, setAssetId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [rcaLeaderId, setRcaLeaderId] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [averageActualRisk, setAverageActualRisk] = useState("");
  const [potentialRiskImpact, setPotentialRiskImpact] = useState("");
  const [mapLocation, setMapLocation] = useState("");
  const [organization, setOrganization] = useState("");
  const [notes, setNotes] = useState("");
  const [types, setTypes] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredDepartments = useMemo(
    () =>
      organization
        ? (departments ?? []).filter((d) => d.organization?.id === organization)
        : departments ?? [],
    [departments, organization]
  );

  useEffect(() => {
    if (organization && departmentId) {
      const stillInList = filteredDepartments.some((d) => d.id === departmentId);
      if (!stillInList) setDepartmentId("");
    }
  }, [organization, departmentId, filteredDepartments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Please enter an RCA title.");
      return;
    }
    setSubmitting(true);
    const asset = assets.find((a) => a.id === assetId);
    const department = (departments ?? []).find((d) => d.id === departmentId);
    const leader = users.find((u) => u.id === rcaLeaderId);
    const record = createRcaRecordFromForm({
      name: trimmedName,
      template,
      assetId: assetId || undefined,
      assetName: asset?.name,
      departmentId: departmentId || undefined,
      departmentName: department?.name,
      eventDate: eventDate || undefined,
      rcaLeaderId: rcaLeaderId || undefined,
      rcaLeaderName: leader ? userDisplayName(leader) : undefined,
      severityLevel: severityLevel || undefined,
      averageActualRisk: (averageActualRisk || undefined) as "High" | "Medium" | "Low" | undefined,
      potentialRiskImpact: (potentialRiskImpact || undefined) as "High" | "Medium" | "Low" | undefined,
      mapLocation: mapLocation || undefined,
      organization: organization || undefined,
      notes: notes || undefined,
      types: types || undefined,
      tags: tags || undefined,
      initiatedById: currentUser?.user_id,
      initiatedByName: currentUser?.email,
    });
    saveRca(record);
    toast.success("RCA created. Opening...");
    router.push(ROUTES.RCA_VIEW(record.id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Text variant="h6" className="text-gray-900">
          Create New RCA
        </Text>
        <Text variant="p" className="text-gray-600 mt-1">
          RCA ID will be assigned on create (format: RCA-YYYY-XXXX). Link an asset and department for traceability.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          label="Title *"
          placeholder="Short summary of the incident"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
        />

        <div>
          <Text variant="p" className="font-medium text-gray-700 mb-2">
            Investigation method *
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTemplate(t.value)}
                className={`
                  text-left p-4 rounded-lg border-2 transition
                  flex flex-col gap-2
                  ${template === t.value ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300 bg-white"}
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${template === t.value ? "border-green-600" : "border-gray-300"}
                    `}
                  >
                    {template === t.value && (
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{t.label}</span>
                </div>
                <p className="text-sm text-gray-600">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        <Select value={assetId} onValueChange={setAssetId}>
          <SelectTrigger label="Asset *">
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent>
            {assets.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        <Select value={organization} onValueChange={setOrganization}>
          <SelectTrigger label="Organization">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger label="Department *">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {filteredDepartments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        <Input
          label="Event date *"
          type="datetime-local"
          value={eventDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value)}
        />

        <Select value={rcaLeaderId} onValueChange={setRcaLeaderId}>
          <SelectTrigger label="RCA Leader *">
            <SelectValue placeholder="Select investigator" />
          </SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {userDisplayName(u)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={severityLevel} onValueChange={setSeverityLevel}>
          <SelectTrigger label="Severity level *">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {SEVERITY_LEVELS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-3">
        <Select value={averageActualRisk} onValueChange={setAverageActualRisk}>
          <SelectTrigger label="Average actual risk">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={potentialRiskImpact} onValueChange={setPotentialRiskImpact}>
          <SelectTrigger label="Potential risk impact">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        </div>

        <Input
          label="Location"
          placeholder="Enter an address or general location"
          value={mapLocation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMapLocation(e.target.value)}
        />

        <Input
          label="Notes"
          type="textarea"
          rows={3}
          placeholder="Additional context"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNotes(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
        <Select value={types} onValueChange={setTypes}>
          <SelectTrigger label="Types">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="incident">Incident</SelectItem>
            <SelectItem value="near-miss">Near Miss</SelectItem>
            <SelectItem value="audit">Audit</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Input
          label="Tags"
          placeholder="Type to filter tags"
          value={tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
        />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
            Create and open
          </Button>
          <Link href={ROUTES.RCA}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
