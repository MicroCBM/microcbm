import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Sample" };

export default function EditSampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
