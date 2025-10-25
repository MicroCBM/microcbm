"use client";
import React from "react";
import { Text } from "@/components";
import { AddDepartmentModal } from "./AddDepartmentModal";

export function DepartmentContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Departments</Text>
        <AddDepartmentModal />
      </div>
    </div>
  );
}
