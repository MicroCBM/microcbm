"use server";
import React from "react";
import { AddSiteForm } from "./components";
import { getAllOrganizationsService } from "@/app/actions";

export default async function AddSitePage() {
  const organizations = await getAllOrganizationsService();

  return (
    <main className="flex flex-col gap-4">
      <AddSiteForm organizations={organizations} />
    </main>
  );
}
