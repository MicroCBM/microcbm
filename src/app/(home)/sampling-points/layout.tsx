import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sampling Points" };

export default function SamplingPointsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
