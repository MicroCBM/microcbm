"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  PersistedModalStateOptions,
  PersistedModalStateReturn,
} from "@/types";

export function usePersistedModalState<TModalData = unknown>({
  paramName = "modal",
  defaultValue = null,
  resetOnRouteChange = false,
}: PersistedModalStateOptions = {}): PersistedModalStateReturn<TModalData> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef(pathname);

  // Get values from URL
  const modalState = searchParams.get(paramName) ?? defaultValue ?? "";
  const modalDataFromUrl = searchParams.get("modalData") ?? "";

  const updateUrlParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const newParams = new URLSearchParams(searchParams.toString());
      updater(newParams);

      const queryString = newParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const openModal = useCallback(
    (modalName: string, data?: TModalData) => {
      updateUrlParams((newParams) => {
        newParams.set(paramName, modalName);

        if (data !== undefined) {
          try {
            newParams.set("modalData", JSON.stringify(data));
          } catch (error) {
            console.warn("Failed to serialize modal data:", error);
            newParams.delete("modalData");
          }
        } else {
          newParams.delete("modalData");
        }
      });
    },
    [paramName, updateUrlParams]
  );

  const closeModal = useCallback(() => {
    updateUrlParams((newParams) => {
      newParams.delete(paramName);
      newParams.delete("modalData");
    });
  }, [paramName, updateUrlParams]);

  const isModalOpen = useCallback(
    (modalName?: string) => {
      const currentModal = modalState || null;
      if (!modalName) {
        return Boolean(currentModal);
      }
      return currentModal === modalName;
    },
    [modalState]
  );

  const parsedModalData = useMemo(() => {
    if (!modalDataFromUrl) return null;
    try {
      return JSON.parse(modalDataFromUrl) as TModalData;
    } catch (error) {
      console.warn("Failed to parse modal data from URL:", error);
      return null;
    }
  }, [modalDataFromUrl]);

  useEffect(() => {
    if (resetOnRouteChange && pathname !== previousPathRef.current) {
      closeModal();
    }
    previousPathRef.current = pathname;
  }, [resetOnRouteChange, pathname, closeModal]);

  return useMemo(
    () => ({
      modalState: modalState || null,
      modalData: parsedModalData,
      openModal,
      closeModal,
      isModalOpen,
    }),
    [modalState, parsedModalData, openModal, closeModal, isModalOpen]
  );
}
