"use client";
import React from "react";
import { AddNewUser } from "./AddNewUser";
import { UserFilters } from "./UserFilters";
import { Text } from "@/components";
import { Organization, Role, Sites } from "@/types";

export function UserContent({
  rolesData,
  organizations,
  sites,
}: {
  rolesData: Role[];
  organizations: Organization[];
  sites: Sites[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Users</Text>
        <AddNewUser
          rolesData={rolesData}
          organizations={organizations}
          sites={sites}
        />
      </div>
      <UserFilters />
    </div>
  );
}
