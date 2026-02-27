import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your MicroCBM password",
};

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
