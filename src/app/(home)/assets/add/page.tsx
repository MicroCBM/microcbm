"use server";
import { getSitesService, getUsersService, getOrganizationsService } from "@/app/actions";
import { AddAssetForm } from "./components/AddAssetForm";

export default async function AddAssetPage() {
  const [sites, users, organizations] = await Promise.all([
    getSitesService(),
    getUsersService(),
    getOrganizationsService(),
  ]);
  return (
    <main className="flex flex-col gap-4">
      <AddAssetForm sites={sites} users={users} organizations={organizations} />
    </main>
  );
}
