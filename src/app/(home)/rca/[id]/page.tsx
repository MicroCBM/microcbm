"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RcaWorkflowTabs } from "../components/RcaWorkflowTabs";
import { getRcaById } from "../lib/rca-storage";
import type { RcaRecord } from "@/types";
import { ROUTES } from "@/utils/route-constants";

export default function RcaViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const [record, setRecord] = useState<RcaRecord | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !id) return;
    const r = getRcaById(id);
    setRecord(r ?? null);
  }, [id]);

  if (!id) {
    router.replace(ROUTES.RCA);
    return null;
  }

  if (record === undefined) return <div className="p-4">Loading...</div>;
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
