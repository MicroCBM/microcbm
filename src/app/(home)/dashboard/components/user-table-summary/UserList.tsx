import { UserTable } from "@/app/(home)/user-management/components";
import { Organization, Role, Sites, User } from "@/types";
import React from "react";

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
