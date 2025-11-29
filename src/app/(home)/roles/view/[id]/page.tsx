"use server";

import {
  getSingleRoleService,
  getUsersByRoleIdService,
  getOrganizationsService,
  getSitesService,
} from "@/app/actions";
import { SingleRoleInfo, UserRoleTable } from "../../components";

interface SingleAdminPermissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface USER_TYPE {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  organization?: {
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    industry: string;
    logo_url: string;
    members: unknown;
    name: string;
    owner: unknown;
    sites: unknown;
    team_strength: string;
    updated_at: number;
    updated_at_datetime: string;
  } | null;
  password_hash: string;
  phone: string;
  role: string;
  role_id: string | null;
  role_obj: unknown;
  site: {
    address: string;
    attachments: null;
    city: string;
    country: string;
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    installation_environment: string;
    manager_email: string;
    manager_location: string;
    manager_name: string;
    manager_phone_number: string;
    members: unknown;
    name: string;
    organization: unknown;
    regulations_and_standards: unknown;
    tag: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  status: string;
  updated_at: number;
  updated_at_datetime: string;
}

export default async function SingleAdminPermissionsPage({
  params,
}: SingleAdminPermissionsPageProps) {
  const { id } = await params;
  const role = await getSingleRoleService(id);
  const users = await getUsersByRoleIdService(id);
  const organizations = await getOrganizationsService();
  const sites = await getSitesService();

  console.log("users", users);

  return (
    <main className="flex flex-col gap-4">
      <SingleRoleInfo role={role} />
      <UserRoleTable
        data={users as USER_TYPE[]}
        organizations={organizations}
        sites={sites}
      />
    </main>
  );
}
