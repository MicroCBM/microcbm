"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Recommendation, Sites, Assets } from "@/types";

interface EditRecommendationModalProps {
  recommendation: Recommendation | null;
  recommendationId: string;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  sites: Sites[];
  assets: Assets[];
}

export function EditRecommendationModal({
  recommendation,
  recommendationId,
  isEditModalOpen,
  setIsEditModalOpen,
  sites,
  assets,
}: EditRecommendationModalProps) {
  const router = useRouter();

  React.useEffect(() => {
    if (isEditModalOpen && recommendationId) {
      router.push(`/recommendations/edit/${recommendationId}`);
      setIsEditModalOpen(false);
    }
  }, [isEditModalOpen, recommendationId, router, setIsEditModalOpen]);

  return null;
}
