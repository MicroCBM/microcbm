"use client";

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

interface AlarmTableProps {
  data: Alarm[];
  className?: string;
  sites?: Sites[];
}

export function AlarmTable({
  data,
  className,
  sites = [],
}: AlarmTableProps) {
  const { modal, query, setQuery } = useAlarmManagementBase();

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
          Alarms ({data?.length ?? 0})
        </Text>
      </div>
      <PaginatedTable<Alarm>
        filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
        columns={alarmListColumns}
        data={data}
        query={query}
        setQuery={setQuery}
        total={data?.length ?? 0}
        loading={false}
        csvHeaders={alarmListCsvHeaders}
        searchPlaceholder="Search alarms"
        noExport
      />

      <ViewAlarmModal />
      <DeleteAlarmModal />
      <EditAlarmModal />
    </div>
  );
}
