import type { Metadata } from "next";

export const metadata: Metadata = { title: "Alarms" };

export default function AlarmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
