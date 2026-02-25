import React from "react";
import { CreateRcaForm } from "../components/CreateRcaForm";
import { getAssetsService, getDepartmentsService, getUsersService } from "@/app/actions";
import { getCurrentUser } from "@/libs/session";

export default async function NewRcaPage() {
  const [assetsResult, departmentsResult, usersResult, currentUser] = await Promise.all([
    getAssetsService({ page: 1, limit: 200 }).catch(() => ({ data: [] })),
    getDepartmentsService({ page: 1, limit: 100 }).catch(() => ({ data: [] })),
    getUsersService().catch(() => []),
    getCurrentUser(),
  ]);

  const assets = assetsResult.data ?? [];
  const departments = Array.isArray(departmentsResult.data) ? departmentsResult.data : [];
  const users = Array.isArray(usersResult) ? usersResult : [];

  return (
    <main className="flex flex-col gap-4">
      <CreateRcaForm
        assets={assets}
        departments={departments}
        users={users}
        currentUser={currentUser}
      />
    </main>
  );
}
