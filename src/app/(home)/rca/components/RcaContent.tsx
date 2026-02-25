"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Text, Button } from "@/components";
import { ROUTES } from "@/utils/route-constants";
import { getRcaList, deleteRca } from "../lib/rca-storage";
import type { RcaRecord } from "@/types";

export function RcaContent() {
  const [list, setList] = useState<RcaRecord[]>([]);

  const loadList = useCallback(() => {
    setList(getRcaList());
  }, []);

  React.useEffect(() => {
    loadList();
  }, [loadList]);

  const handleDelete = useCallback(
    (id: string) => {
      if (typeof window !== "undefined" && window.confirm("Delete this RCA?")) {
        deleteRca(id);
        loadList();
      }
    },
    [loadList]
  );

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
        <Link href={ROUTES.RCA_NEW}>
          <Button variant="primary">Create RCA</Button>
        </Link>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {list.length === 0 ? (
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
              {list.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono text-gray-600">{r.rcaId ?? r.id}</td>
                  <td className="p-3">
                    <Link href={ROUTES.RCA_VIEW(r.id)} className="text-blue-600 hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className="text-gray-600">{r.status ?? "Draft"}</span>
                  </td>
                  <td className="p-3 text-gray-600">{new Date(r.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link href={ROUTES.RCA_VIEW(r.id)} className="text-blue-600 hover:underline mr-2">
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
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
    </div>
  );
}
