import { UserTable } from "@/app/(home)/user-management/components";
import { Organization, Sites, User } from "@/types";
import React from "react";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  created_at: number;
  created_at_datetime: string;
}

export default function userList({
  users,
  roles,
  organizations,
  sites,
}: {
  users: User[];
  roles: Role[];
  organizations: Organization[];
  sites: Sites[];
}) {
  return (
    <UserTable
      data={users}
      rolesData={roles}
      organizations={organizations}
      sites={sites}
    />
  );
}
