"use client";

import { usePersistedModalState, useReducerSpread } from "@/hooks";
import { DEFAULT_QUERY } from "@/utils/constants";
import { MODALS } from "@/utils/constants/modals";
import { Sample } from "@/types";

export function useSampleManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const modal = usePersistedModalState<{ sample: Sample }>({
    paramName: MODALS.SAMPLE.PARAM_NAME,
  });

  return {
    modal,
    query,
    setQuery,
  };
}
