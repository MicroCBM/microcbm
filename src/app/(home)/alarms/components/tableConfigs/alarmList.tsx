"use client";

import { Icon } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  Text,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Alarm, Sites } from "@/types";
import { CsvHeader } from "@/types";

interface AlarmListColumnsProps<T extends Alarm = Alarm> {
  sites: Sites[];
  onViewAlarm: (alarm: T) => void;
  onEditAlarm: (alarm: T) => void;
  onDeleteAlarm: (alarm: T) => void;
}

export function getAlarmListColumns<T extends Alarm = Alarm>({
  sites,
  onViewAlarm,
  onEditAlarm,
  onDeleteAlarm,
}: AlarmListColumnsProps<T>): ColumnDef<T>[] {
  return [
    {
      id: "parameter",
      header: "Parameter",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900">
            {row.original.parameter}
          </span>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "site",
      header: "Site",
      cell: ({ row }) => {
        const site = sites.find((s) => s.id === row.original.site?.id);
        return (
          <span className="text-sm text-gray-900">{site?.name || "-"}</span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "first_detected",
      header: "First Detected",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {dayjs(row.original.first_detected).format("MMM D, YYYY HH:mm")}
        </span>
      ),
      size: 180,
    },
    {
      accessorKey: "acknowledged_status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={
            row.original.acknowledged_status === true ? "Active" : "Inactive"
          }
        />
      ),
      size: 150,
    },
    {
      accessorKey: "linked_recommendations",
      header: "Recommendations",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.linked_recommendations?.length || 0}
        </span>
      ),
      size: 150,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="small">
                <Icon
                  icon="mdi:dots-vertical"
                  className="w-4 h-4 text-gray-600"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="px-4 py-2 bg-black text-white">
                <Text variant="span">Select an option</Text>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                  onClick={() => onViewAlarm(row.original)}
                >
                  View Alarm
                </button>
                <button
                  onClick={() => onEditAlarm(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Alarm
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => onDeleteAlarm(row.original)}
                >
                  Delete Alarm
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      size: 80,
    },
  ];
}

export const alarmListCsvHeaders: Array<CsvHeader> = [
  {
    name: "Parameter",
    accessor: "parameter",
  },
  {
    name: "Site",
    accessor: "site.name",
  },
  {
    name: "First Detected",
    accessor: "first_detected",
  },
  {
    name: "Acknowledged Status",
    accessor: "acknowledged_status",
  },
  {
    name: "Linked Recommendations",
    accessor: "linked_recommendations",
  },
];
