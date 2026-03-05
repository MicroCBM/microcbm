"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Text, Button } from "@/components";
import Input from "@/components/input/Input";
import { ROUTES } from "@/utils/route-constants";
import { deleteRca } from "../lib/rca-storage";
import { deleteRcaService } from "@/app/actions/rcas";
import type { RcaListRow } from "../lib/rca-list";
import { toast } from "sonner";
import { DeleteRcaModal } from "./DeleteRcaModal";
import { ViewRcaModal } from "./ViewRcaModal";
import { ComponentGuard } from "@/components/content-guard";

export type { RcaListRow } from "../lib/rca-list";

export interface RcaContentProps {
  initialList: RcaListRow[];
  initialSearchName?: string;
}

export function RcaContent({ initialList, initialSearchName = "" }: RcaContentProps) {
  const router = useRouter();
  const [searchName, setSearchName] = useState(initialSearchName);
  const [deleteTarget, setDeleteTarget] = useState<RcaListRow | null>(null);
  const [viewTarget, setViewTarget] = useState<RcaListRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchName.trim() ? `?name=${encodeURIComponent(searchName.trim())}` : "";
      router.push(`${ROUTES.RCA}${q}`);
    },
    [router, searchName]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteRcaService(id).then((res) => {
        if (res.success) {
          deleteRca(id);
          toast.success("RCA deleted.");
          setDeleteTarget(null);
          router.refresh();
        } else {
          toast.error(res.message ?? "Failed to delete RCA.");
        }
        setIsDeleting(false);
      });
    },
    [router]
  );

  const openDeleteModal = (r: RcaListRow) => {
    setDeleteTarget(r);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    handleDelete(deleteTarget.id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Text variant="h6" className="text-gray-900">
            Root Cause Analyses
          </Text>
          <Text variant="p" className="text-gray-600">
            Create and manage cause-and-effect charts
          </Text>
        </div>
        <ComponentGuard permissions="rcas:create" unauthorizedFallback={null}>
          <Link href={ROUTES.RCA_NEW}>
            <Button variant="primary">Create RCA</Button>
          </Link>
        </ComponentGuard>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          className="min-w-[200px] max-w-sm"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {searchName.trim() && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearchName("");
              router.push(ROUTES.RCA);
            }}
          >
            Clear
          </Button>
        )}
      </form>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {initialList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Text variant="p">No RCAs yet. Click &quot;Create RCA&quot; to start.</Text>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">RCA ID</th>
                <th className="text-left p-3 font-medium text-gray-700">Title</th>
                <th className="text-left p-3 font-medium text-gray-700">Status</th>
                <th className="text-left p-3 font-medium text-gray-700">Updated</th>
                <th className="text-right p-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialList.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono text-gray-600">{r.rcaId}</td>
                  <td className="p-3">
                    <Link href={ROUTES.RCA_VIEW(r.id)} className="text-blue-600 hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className="text-gray-600">{r.status}</span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setViewTarget(r)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      View
                    </button>
                    <Link href={ROUTES.RCA_VIEW(r.id)} className="text-blue-600 hover:underline mr-2">
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(r)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteRcaModal
        rca={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
      <ViewRcaModal
        rca={viewTarget}
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
