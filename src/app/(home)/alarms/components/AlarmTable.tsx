"use client";

import React, { useMemo } from "react";
import { cn } from "@/libs";
import { PaginatedTable, Text } from "@/components";
import { Alarm, Sites } from "@/types";
import {
  ViewAlarmModal,
  DeleteAlarmModal,
  EditAlarmModal,
} from "./modals";
import {
  getAlarmListColumns,
  alarmListCsvHeaders,
} from "./tableConfigs";
import { useAlarmManagementBase } from "../hooks";
import { MODALS } from "@/utils/constants/modals";
import { useRouter, useSearchParams } from "next/navigation";
import type { AlarmsMeta } from "@/app/actions/alarms";

interface AlarmTableProps {
  data: Alarm[];
  meta: AlarmsMeta;
  className?: string;
  sites?: Sites[];
}

export function AlarmTable({
  data,
  meta,
  className,
  sites = [],
}: AlarmTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, query, setQuery } = useAlarmManagementBase();

  const pageFromUrl = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1
  );
  const limitFromUrl = Math.max(
    1,
    Math.min(100, parseInt(searchParams.get("limit") ?? "10", 10) || 10)
  );
  const site_id = searchParams.get("site_id") ?? "";
  const severity = searchParams.get("severity") ?? "";

  const querySyncedWithUrl = useMemo(
    () => ({
      ...query,
      page: pageFromUrl,
      limit: limitFromUrl,
      search: "",
    }),
    [query, pageFromUrl, limitFromUrl]
  );

  const setQueryAndNavigate = (nextQuery: typeof query) => {
    const params = new URLSearchParams();
    const page = Number(nextQuery.page) || 1;
    const limit = Number(nextQuery.limit) || 10;
    if (page !== 1) params.set("page", String(page));
    if (limit !== 10) params.set("limit", String(limit));
    if (site_id) params.set("site_id", site_id);
    if (severity) params.set("severity", severity);
    const q = params.toString();
    router.push(`/alarms${q ? `?${q}` : ""}`);
    setQuery(nextQuery);
  };

  const handleViewAlarm = (alarm: Alarm) => {
    modal.openModal(MODALS.ALARM.CHILDREN.VIEW, { alarm });
  };

  const handleEditAlarm = (alarm: Alarm) => {
    modal.openModal(MODALS.ALARM.CHILDREN.EDIT, { alarm });
  };

  const handleDeleteAlarm = (alarm: Alarm) => {
    modal.openModal(MODALS.ALARM.CHILDREN.DELETE, { alarm });
  };

  const alarmListColumns = getAlarmListColumns({
    sites,
    onViewAlarm: handleViewAlarm,
    onEditAlarm: handleEditAlarm,
    onDeleteAlarm: handleDeleteAlarm,
  });

  return (
    <div className={cn("relative space-y-[37px]", className)}>
      <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
        <Text variant="h6" weight="medium">
          Alarms ({meta.total})
        </Text>
      </div>
      <PaginatedTable<Alarm>
        filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
        columns={alarmListColumns}
        data={data}
        query={querySyncedWithUrl}
        setQuery={setQueryAndNavigate}
        total={meta.total}
        loading={false}
        csvHeaders={alarmListCsvHeaders}
        searchPlaceholder="Search alarms"
        noExport
        noSearch
      />

      <ViewAlarmModal />
      <DeleteAlarmModal />
      <EditAlarmModal />
    </div>
  );
}
