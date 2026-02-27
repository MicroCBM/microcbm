import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Recommendation" };

export default function EditRecommendationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
