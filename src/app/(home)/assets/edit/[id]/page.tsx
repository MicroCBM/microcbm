"use server";
import {
  getAssetService,
  getSitesService,
  getUsersService,
} from "@/app/actions";
import { EditAssetForm } from "../components";

interface EditAssetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAssetPage({ params }: EditAssetPageProps) {
  const { id } = await params;
  const sites = await getSitesService();
  const users = await getUsersService();
  const asset = await getAssetService(id);

  return (
    <main className="flex flex-col gap-4">
      <EditAssetForm sites={sites} users={users} assetId={id} asset={asset} />
    </main>
  );
}
