"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
  Button,
} from "@/components";
import { ROUTES } from "@/utils/route-constants";
import { getRcaByIdService } from "@/app/actions/rcas";
import type { RcaApiListItem } from "@/app/actions/rcas";
import type { RcaListRow } from "../lib/rca-list";
import { usePresignedUrl } from "@/hooks";

interface ViewRcaModalProps {
  rca: RcaListRow | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatUser(u: { first_name?: string; last_name?: string; email?: string } | null | undefined): string {
  if (!u) return "—";
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name || u.email || "—";
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "" || value === "—") return null;
  return (
    <div className="flex justify-between items-start gap-2">
      <Text variant="span" className="text-gray-600 font-medium shrink-0 text-sm">
        {label}:
      </Text>
      <Text variant="span" className="text-gray-900 text-right text-sm break-words max-w-[60%]">
        {value}
      </Text>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Text variant="span" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </Text>
      <div className="p-3 rounded-md bg-gray-50 border border-gray-100 space-y-2">
        {children}
      </div>
    </div>
  );
}

/** Evidence item from API: id, description, evidence_type, attachments (file keys). */
type ApiEvidenceItem = {
  id?: string;
  description?: string;
  evidence_type?: string;
  attachments?: string[];
};

/** Renders an evidence image from a storage file key using presigned URL (same pattern as RcaTabEvidence). */
function EvidenceThumbnail({
  fileKey,
  description,
}: {
  fileKey: string;
  description?: string;
}) {
  const { url, isLoading } = usePresignedUrl(fileKey, !!fileKey);
  if (!fileKey) return null;
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-white">
        <span className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          …
        </span>
        {description && <span className="text-sm text-gray-600 truncate flex-1">{description}</span>}
      </div>
    );
  }
  if (!url) {
    return (
      <div className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-white">
        <span className="text-sm text-gray-500">Unable to load</span>
        {description && <span className="text-sm text-gray-600 truncate flex-1">{description}</span>}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-white">
      <Image
        src={url}
        alt={description ?? "Evidence"}
        width={64}
        height={64}
        unoptimized
        className="w-16 h-16 object-cover rounded border border-gray-200 shrink-0"
      />
      {description && <span className="text-sm text-gray-600 truncate flex-1">{description}</span>}
    </div>
  );
}

export function ViewRcaModal({ rca, isOpen, onClose }: ViewRcaModalProps) {
  const [details, setDetails] = useState<RcaApiListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !rca?.id) {
      setDetails(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getRcaByIdService(rca.id)
      .then((response) => {
        if (response.success && response.data) {
          const body = response.data as { data?: RcaApiListItem };
          const apiRca = body?.data;
          setDetails(apiRca ?? null);
          if (!apiRca) setError("RCA not found.");
        } else {
          setError(response.message ?? "Failed to load RCA.");
        }
      })
      .catch(() => setError("Failed to load RCA."))
      .finally(() => setLoading(false));
  }, [isOpen, rca?.id]);

  if (!rca) return null;

  const d = details;
  const ps = d?.problem_statement;
  const actionsCount = Array.isArray(d?.actions) ? d.actions.length : 0;
  const evidenceCount = Array.isArray(d?.evidence) ? d.evidence.length : 0;
  const analysisCount = Array.isArray(d?.analysis_entries) ? d.analysis_entries.length : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[440px] flex flex-col p-0" side="right">
        <SheetHeader className="p-6 pb-4 border-b border-gray-100 shrink-0">
          <SheetTitle>View RCA</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {loading && (
            <p className="text-sm text-gray-500">Loading details…</p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && (
            <>
              <Section title="Overview">
                <DetailRow label="RCA ID" value={d?.id ?? rca.rcaId} />
                <DetailRow label="Title" value={d?.title ?? rca.title} />
                <DetailRow label="Method" value={d?.method} />
                <DetailRow label="Type" value={d?.type} />
                <DetailRow label="Severity" value={d?.severity} />
                <DetailRow
                  label="Event date"
                  value={d?.event_date ? new Date(d.event_date).toLocaleDateString() : undefined}
                />
                <DetailRow
                  label="Created"
                  value={d?.created_at_datetime ? new Date(d.created_at_datetime).toLocaleString() : undefined}
                />
                <DetailRow
                  label="Updated"
                  value={
                    d?.updated_at_datetime ?? rca.updatedAt
                      ? new Date(d?.updated_at_datetime ?? rca.updatedAt).toLocaleString()
                      : undefined
                  }
                />
              </Section>

              <Section title="Location & context">
                <DetailRow label="Physical location" value={d?.physical_location} />
                <DetailRow
                  label="Asset"
                  value={
                    d?.parent_asset?.name ||
                    (d?.parent_asset as { tag?: string } | undefined)?.tag
                  }
                />
                <DetailRow label="Department" value={d?.department?.name} />
                <DetailRow label="Organization" value={d?.organization?.name} />
              </Section>

              <Section title="People">
                <DetailRow label="RCA Leader" value={d?.rca_leader ? formatUser(d.rca_leader) : undefined} />
                <DetailRow label="Initiated by" value={d?.initiated_by ? formatUser(d.initiated_by) : undefined} />
              </Section>

              {ps && (ps.focal_point || ps.start_date || ps.end_date) && (
                <Section title="Problem statement">
                  <DetailRow label="Focal point" value={ps.focal_point as string} />
                  <DetailRow
                    label="Start date"
                    value={ps.start_date ? new Date(ps.start_date as string).toLocaleDateString() : undefined}
                  />
                  <DetailRow
                    label="End date"
                    value={ps.end_date ? new Date(ps.end_date as string).toLocaleDateString() : undefined}
                  />
                  <DetailRow label="Business unit" value={ps.business_unit as string} />
                  <DetailRow label="Location" value={ps.location as string} />
                </Section>
              )}

              <Section title="Impact & metrics">
                <DetailRow label="Production impact (hours)" value={d?.production_impact_in_hours} />
                <DetailRow label="Estimated cost impact" value={d?.estimated_cost_impact} />
              </Section>

              <Section title="Summaries">
                <DetailRow
                  label="Executive summary"
                  value={
                    d?.executive_summary ? (
                      <span className="block line-clamp-4">{d.executive_summary}</span>
                    ) : undefined
                  }
                />
                <DetailRow
                  label="Cause & effect summary"
                  value={
                    d?.cause_and_effective_summary ? (
                      <span className="block line-clamp-4">{d.cause_and_effective_summary}</span>
                    ) : undefined
                  }
                />
              </Section>

              <Section title="Notes & tags">
                <DetailRow label="Notes" value={d?.notes} />
                <DetailRow label="Tags" value={d?.tags} />
              </Section>

              {Array.isArray(d?.evidence) && d.evidence.length > 0 && (
                <Section title="Evidence">
                  <div className="space-y-2">
                    {(d.evidence as ApiEvidenceItem[]).map((item, idx) => {
                      const fileKey = typeof item.attachments?.[0] === "string" ? item.attachments[0] : undefined;
                      const key = item.id ?? fileKey ?? `ev-${idx}`;
                      if (fileKey) {
                        return (
                          <EvidenceThumbnail
                            key={key}
                            fileKey={fileKey}
                            description={item.description}
                          />
                        );
                      }
                      return (
                        <div key={key} className="p-2 rounded border border-gray-200 bg-white text-sm text-gray-700">
                          {item.description ?? item.evidence_type ?? "Evidence"}
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              <Section title="Counts">
                <DetailRow label="Corrective actions" value={actionsCount > 0 ? String(actionsCount) : undefined} />
                <DetailRow label="Evidence items" value={evidenceCount > 0 ? String(evidenceCount) : undefined} />
                <DetailRow label="Analysis entries" value={analysisCount > 0 ? String(analysisCount) : undefined} />
              </Section>
            </>
          )}

          {!loading && (
            <Link href={ROUTES.RCA_VIEW(rca.id)} onClick={onClose} className="shrink-0">
              <Button variant="primary" className="w-full">
                Open full
              </Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
