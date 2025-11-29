"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlState(key: string, defaultValue = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    return searchParams?.get(key) ?? defaultValue;
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams?.toString());

      if (newValue) {
        params.set(key, newValue);
      } else {
        params.delete(key);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, key, pathname, router]
  );

  return [value, setValue] as const;
}
