"use client";

import { usePersistedModalState, useReducerSpread } from "@/hooks";
import { DEFAULT_QUERY } from "@/utils/constants";
import { MODALS } from "@/utils/constants/modals";

export function useRecommendationManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const modal = usePersistedModalState({
    paramName: MODALS.RECOMMENDATION.PARAM_NAME,
  });

  return {
    modal,
    query,
    setQuery,
  };
}
