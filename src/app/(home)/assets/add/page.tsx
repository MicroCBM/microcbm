"use client";
import React from "react";
import { AddAssetForm } from "./components/AddAssetForm";
import { Button, Text } from "@/components";
import { Icon } from "@/libs";
import { useRouter } from "next/navigation";

export default function AddAssetPage() {
  const router = useRouter();
  return (
    <main className="flex flex-col gap-4">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 border border-gray-200 flex items-center justify-center"
          >
            <Icon icon="mdi:chevron-left" className=" size-5" />
          </button>

          <Text variant="h6">Add Asset</Text>
        </div>

        <div className="flex items-center gap-2">
          <Button size="medium" variant="outline">
            Discard
          </Button>
          <Button size="medium" variant="outline">
            Save Draft
          </Button>
          <Button size="medium">Create Asset</Button>
        </div>
      </section>

      <AddAssetForm />
    </main>
  );
}
