import { getSitesService, getUsersService, getOrganizationsService } from "@/app/actions";
import { AddAssetForm } from "./components/AddAssetForm";

export const dynamic = "force-dynamic";

export default async function AddAssetPage() {
  const [sitesResult, users, organizationsResult] = await Promise.all([
    getSitesService(),
    getUsersService(),
    getOrganizationsService(),
  ]);
  const sites = sitesResult.data;
  const organizations = organizationsResult.data;
  return (
    <main className="flex flex-col gap-4">
      <AddAssetForm sites={sites} users={users} organizations={organizations} />
    </main>
  );
}
