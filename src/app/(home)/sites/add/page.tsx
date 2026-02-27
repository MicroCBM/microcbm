import type { Metadata } from "next";
import React from "react";
import { AddSiteForm } from "./components";
import { getOrganizationsService, getUsersService } from "@/app/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Add Site" };

export default async function AddSitePage() {
  const [organizationsResult, users] = await Promise.all([
    getOrganizationsService(),
    getUsersService(),
  ]);
  const organizations = organizationsResult.data;

  return (
    <main className="flex flex-col gap-4">
      <AddSiteForm organizations={organizations} users={users} />
    </main>
  );
}
