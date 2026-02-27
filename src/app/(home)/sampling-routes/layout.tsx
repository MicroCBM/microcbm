import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sampling Routes" };

export default function SamplingRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
