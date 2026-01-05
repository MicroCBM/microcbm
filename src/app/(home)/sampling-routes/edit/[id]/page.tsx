"use server";
import React from "react";
import { EditSamplingRouteForm } from "./components/EditSamplingRouteForm";
import {
  getUsersService,
  getSitesService,
  getSamplingRouteService,
  getOrganizationsService,
} from "@/app/actions";
import { notFound } from "next/navigation";

interface EditSamplingRoutePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSamplingRoutePage({
  params,
}: EditSamplingRoutePageProps) {
  try {
    const { id } = await params;
    const [users, sites, samplingRoute, organizations] = await Promise.all([
      getUsersService(),
      getSitesService(),
      getSamplingRouteService(id),
      getOrganizationsService(),
    ]);

    // Filter users to only include technicians by role_id
    const technicians = users.filter(
      (user) => user.role_id === "2ae0bde9-b900-49dc-b137-83e424bad3c6"
    );

    return (
      <main className="flex flex-col gap-4">
        <EditSamplingRouteForm
          technicians={technicians}
          sites={sites}
          samplingRoute={samplingRoute}
          organizations={organizations}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data for edit sampling route:", error);
    notFound();
  }
}
