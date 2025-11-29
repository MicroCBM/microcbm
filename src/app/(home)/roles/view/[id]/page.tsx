"use server";

import {
  getSingleRoleService,
  getUsersByRoleIdService,
  getOrganizationsService,
} from "@/app/actions";
import { SingleRoleInfo, UserRoleTable } from "../../components";

interface SingleAdminPermissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SingleAdminPermissionsPage({
  params,
}: SingleAdminPermissionsPageProps) {
  const { id } = await params;
  const role = await getSingleRoleService(id);
  const users = await getUsersByRoleIdService(id);
  const organizations = await getOrganizationsService();

  console.log("users", users);

  return (
    <main className="flex flex-col gap-4">
      <SingleRoleInfo role={role} />
      <UserRoleTable data={users as unknown[]} organizations={organizations} />
    </main>
  );
}
