"use server";
import { getUsersService } from "@/app/actions";
import React from "react";
import { UserContent, UserTable } from "./components";

export default async function UserManagementPage() {
  const users = await getUsersService();

  return (
    <main className="flex flex-col gap-4">
      <UserContent />
      <UserTable data={users} />
    </main>
  );
}
