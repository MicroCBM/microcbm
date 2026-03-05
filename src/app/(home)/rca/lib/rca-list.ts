import type { RcaApiListItem } from "@/app/actions/rcas";

/** Row shape for the RCA list table (from API). */
export interface RcaListRow {
  id: string;
  title: string;
  rcaId: string;
  status: string;
  updatedAt: string;
}

export function apiItemToRow(item: RcaApiListItem): RcaListRow {
  return {
    id: item.id,
    title: item.title,
    rcaId: item.id,
    status: "Draft",
    updatedAt: item.updated_at_datetime ?? item.created_at_datetime ?? "",
  };
}
