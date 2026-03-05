"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RcaWorkflowTabs } from "../components/RcaWorkflowTabs";
import { getRcaById, mapApiRcaToRecord, saveRca } from "../lib/rca-storage";
import { getRcaByIdService } from "@/app/actions/rcas";
import type { RcaApiListItem } from "@/app/actions/rcas";
import type { RcaRecord } from "@/types";
import { ROUTES } from "@/utils/route-constants";

export default function RcaViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const [record, setRecord] = useState<RcaRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !id) {
      if (!id) setLoading(false);
      return;
    }
    getRcaByIdService(id).then((response) => {
      console.log("response lemme check", response)
      if (response.success && response.data) {
        const body = response.data as { data?: RcaApiListItem };
        const apiRca = body?.data;
        if (apiRca) {
          const mapped = mapApiRcaToRecord(apiRca);
          saveRca(mapped);
          setRecord(mapped);
        } else {
          setRecord(getRcaById(id) ?? null);
        }
      } else {
        setRecord(getRcaById(id) ?? null);
      }
      setLoading(false);
    });
  }, [id]);

  if (!id) {
    router.replace(ROUTES.RCA);
    return null;
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (record === null) {
    return (
      <div className="p-4">
        <p className="text-gray-600">RCA not found.</p>
        <a href={ROUTES.RCA} className="text-blue-600 hover:underline">
          Back to list
        </a>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-8rem)] flex flex-col">
      <RcaWorkflowTabs record={record} onRecordChange={setRecord} />
    </main>
  );
}
