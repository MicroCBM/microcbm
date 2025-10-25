"use client";

import React from "react";
import { Text } from "@/components";
import { Sites } from "@/types";
import { AddAlarmModal } from "./AddAlarmModal";

interface AlarmContentProps {
  sites: Sites[];
}

export function AlarmContent({ sites }: AlarmContentProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Text variant="h6" className="text-gray-900">
          Alarms
        </Text>
        <Text variant="p" className="text-gray-600">
          Manage and monitor system alarms
        </Text>
      </div>
      <AddAlarmModal sites={sites} />
    </div>
  );
}
