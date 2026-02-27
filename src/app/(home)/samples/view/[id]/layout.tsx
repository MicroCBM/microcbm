import type { Metadata } from "next";

export const metadata: Metadata = { title: "View Sample" };

export default function ViewSampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
