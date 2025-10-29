"use server";
import React from "react";
import { getUsersService, getSitesService } from "@/app/actions";
import { AddSamplingRouteForm } from "./components";

export default async function AddSamplingRoutePage() {
  const users = await getUsersService();
  const sites = await getSitesService();

  console.log("users", users);

  const technicians = users.filter((user) =>
    user.role.toLowerCase().includes("viewer")
  );
  //   const [users, sites] = await Promise.all([
  //     getUsersService(),
  //     getSitesService(),
  //   ]);

  // Filter users to only include technicians
  //   const technicians = users.filter(
  //     (user) =>
  //       user.role.toLowerCase().includes("technician") ||
  //       user.role.toLowerCase().includes("tech")
  //   );

  //   console.log("technicians", technicians);
  console.log("sites", sites);

  return (
    <main className="flex flex-col gap-4">
      <AddSamplingRouteForm technicians={technicians} sites={sites} />
    </main>
  );
}
