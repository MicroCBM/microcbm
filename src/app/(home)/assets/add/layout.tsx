import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Asset" };

export default function AddAssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
