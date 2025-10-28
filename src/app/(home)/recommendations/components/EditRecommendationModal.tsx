"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Recommendation, Sites, Asset } from "@/types";

interface EditRecommendationModalProps {
  recommendation: Recommendation | null;
  recommendationId: string;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  sites: Sites[];
  assets: Asset[];
}

export function EditRecommendationModal({
  recommendationId,
  isEditModalOpen,
  setIsEditModalOpen,
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
