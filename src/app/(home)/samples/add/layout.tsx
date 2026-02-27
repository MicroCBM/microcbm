import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Sample" };

export default function AddSampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
