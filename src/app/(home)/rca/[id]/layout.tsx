import type { Metadata } from "next";

export const metadata: Metadata = { title: "RCA Details" };

export default function RcaDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
