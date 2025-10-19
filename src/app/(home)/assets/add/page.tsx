"use server";
import { getSitesService, getUsersService } from "@/app/actions";
import { AddAssetForm } from "./components/AddAssetForm";

export default async function AddAssetPage() {
  const sites = await getSitesService();
  const users = await getUsersService();
  return (
    <main className="flex flex-col gap-4">
      <AddAssetForm sites={sites} users={users} />
    </main>
  );
}
