"use server";
import React from "react";
import {
  AlarmContent,
  AlarmFilters,
  AlarmsSummery,
  AlarmTable,
} from "./components";
import { getAlarmsService, getSitesService } from "@/app/actions";

export default async function AlarmsPage() {
  const alarms = await getAlarmsService();
  const sites = await getSitesService();
  console.log("alarms", alarms);

  return (
    <main className="flex flex-col gap-4">
      <AlarmContent sites={sites} />
      <AlarmsSummery />
      <AlarmFilters />
      <AlarmTable data={alarms} sites={sites} />
    </main>
  );
}
