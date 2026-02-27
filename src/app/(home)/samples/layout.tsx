import type { Metadata } from "next";

export const metadata: Metadata = { title: "Samples" };

export default function SamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
