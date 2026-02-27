import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Asset" };

export default function EditAssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
