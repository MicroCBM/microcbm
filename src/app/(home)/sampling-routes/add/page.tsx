import React from "react";
import {
  getUsersService,
  getSitesService,
  getOrganizationsService,
} from "@/app/actions";
import { AddSamplingRouteForm } from "./components";

export const dynamic = "force-dynamic";

export default async function AddSamplingRoutePage() {
  const [users, sites, organizations] = await Promise.all([
    getUsersService(),
    getSitesService(),
    getOrganizationsService(),
  ]);

  console.log("users", users);

  const technicians = users.filter(
    (user) => user.role_id === "2ae0bde9-b900-49dc-b137-83e424bad3c6"
  );

  console.log("technicians", technicians);

  return (
    <main className="flex flex-col gap-4">
      <AddSamplingRouteForm
        technicians={technicians}
        sites={sites}
        organizations={organizations}
      />
    </main>
  );
}
