import type { Metadata } from "next";
import React from "react";
import { RcaContent } from "./components/RcaContent";

export const metadata: Metadata = { title: "Root Cause Analysis" };

export default function RcaPage() {
  return (
    <main className="flex flex-col gap-4">
      <RcaContent />
    </main>
  );
}
