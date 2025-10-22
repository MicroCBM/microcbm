"use client";
import React from "react";
import { Text } from "@/components";
import { AddOrganizationModal } from "./AddOrganizationModal";

export function OrganizationContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Organizations</Text>
        <AddOrganizationModal />
      </div>
    </div>
  );
}
