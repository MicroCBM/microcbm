import type { Metadata } from "next";
import React from "react";
import { getRcasService, type RcaApiListItem } from "@/app/actions/rcas";
import { apiItemToRow } from "./lib/rca-list";
import { RcaContent } from "./components/RcaContent";

export const metadata: Metadata = { title: "Root Cause Analysis" };

const DEFAULT_ORG_ID = "c5fe8c2c-e241-4eeb-8295-df0670a8d85b";

export default async function RcaPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const params = await searchParams;
  const name = typeof params.name === "string" ? params.name.trim() : undefined;
  const response = await getRcasService({
    limit: 50,
    offset: 0,
    organization_id: DEFAULT_ORG_ID,
    ...(name ? { name } : {}),
  });
  const body = response.success && response.data ? (response.data as { data?: RcaApiListItem[] }) : null;
  const apiList = body && Array.isArray(body.data) ? body.data : [];
  const list = apiList.map(apiItemToRow);

  return (
    <main className="flex flex-col gap-4">
      <RcaContent initialList={list} initialSearchName={name ?? ""} />
    </main>
  );
}
