import React from "react";
import { AddSiteForm } from "./components";
import { getOrganizationsService, getUsersService } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AddSitePage() {
  const [organizations, users] = await Promise.all([
    getOrganizationsService(),
    getUsersService(),
  ]);

  return (
    <main className="flex flex-col gap-4">
      <AddSiteForm organizations={organizations} users={users} />
    </main>
  );
}
