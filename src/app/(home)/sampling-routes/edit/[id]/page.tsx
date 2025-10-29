"use server";
import React from "react";
import { EditSamplingRouteForm } from "./components/EditSamplingRouteForm";
import {
  getUsersService,
  getSitesService,
  getSamplingRouteService,
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
    const [users, sites, samplingRoute] = await Promise.all([
      getUsersService(),
      getSitesService(),
      getSamplingRouteService(id),
    ]);

    // Filter users to only include technicians
    const technicians = users.filter(
      (user) =>
        user.role.toLowerCase().includes("technician") ||
        user.role.toLowerCase().includes("tech")
    );

    console.log("technicians", technicians);
    console.log("sites", sites);
    console.log("samplingRoute", samplingRoute);

    return (
      <main className="flex flex-col gap-4">
        <EditSamplingRouteForm
          technicians={technicians}
          sites={sites}
          samplingRoute={samplingRoute}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data for edit sampling route:", error);
    notFound();
  }
}
