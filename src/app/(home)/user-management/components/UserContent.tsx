"use client";
import React from "react";
import { AddNewUser } from "./AddNewUser";
import { UserFilters } from "./UserFilters";
import { Text } from "@/components";

export function UserContent() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Text variant="h6">Users</Text>
        <AddNewUser />
      </div>
      <UserFilters />
    </div>
  );
}
