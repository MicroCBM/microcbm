"use client";
import React from "react";
import { Icon } from "@/libs/icon";
import { Text } from "../text";

export default function ErrorMessage({
  openError,
  errorMessage,
  setOpenError,
}: {
  openError: boolean;
  errorMessage: string;
  setOpenError: (openError: boolean) => void;
}) {
  return (
    <>
      {openError && (
        <div className="border border-red bg-red-100/10 text-red-100 w-full text-left">
          <div className="flex gap-1 items-center bg-red p-2 pr-4">
            <Icon
              icon="hugeicons:information-circle"
              className="size-5 cursor-pointer hover:text-red-100/80"
              onClick={() => setOpenError(false)}
            />
            <Text variant="p">There is 1 error with this product:</Text>
          </div>
          <div className="pt-3 pb-4 px-4 text-black flex flex-col gap-1 bg-white">
            <Text variant="span">{errorMessage}</Text>
          </div>
        </div>
      )}
    </>
  );
}
