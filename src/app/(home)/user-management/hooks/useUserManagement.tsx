"use client";

import { usePersistedModalState, useReducerSpread } from "@/hooks";
import { DEFAULT_QUERY } from "@/utils/constants";
import { MODALS } from "@/utils/constants/modals";

export function useUserManagementBase() {
  const [query, setQuery] = useReducerSpread(DEFAULT_QUERY);

  const modal = usePersistedModalState({
    paramName: MODALS.USER.PARAM_NAME,
  });

  return {
    modal,
    query,
    setQuery,
  };
}
