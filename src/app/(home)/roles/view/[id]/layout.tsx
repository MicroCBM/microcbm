import type { Metadata } from "next";

export const metadata: Metadata = { title: "View Role" };

export default function ViewRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
