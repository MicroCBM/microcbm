import React from "react";

import { Button, CustomIcon, Modal, Text } from "@/components";
import type { Func, IconNames } from "@/types";

type Props = {
  isOpen: boolean;
  reject: Func;
  accept: Func;
  bodyText: string | React.ReactNode;
  title: string;
  actionText?: string;
  icon?: IconNames;
  isLoading?: boolean;
};

export function ConfirmDialog({
  title,
  bodyText,
  actionText = "Delete",
  icon = "ArrowDown",
  isOpen,
  reject,
  accept,
  isLoading,
}: Readonly<Props>) {
  return (
    <Modal panelClass=" " isOpen={isOpen} setIsOpen={reject} position="center">
      <div className="p-6">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <CustomIcon
            name={icon}
            width={48}
            height={48}
            className="text-error"
          />
          <div>
            <Text variant="h3" className="text-center font-semibold">
              {title}
            </Text>
            <p className="mt-4 mx-6 mb-12 text-[#5F6166] text-center">
              {bodyText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={"outline"}
            onClick={reject}
            className="grow"
          >
            Cancel
          </Button>
          <Button
            loading={isLoading}
            onClick={accept}
            variant={
              actionText === "Delete" || actionText === "Remove"
                ? "danger"
                : "primary"
            }
            className="grow"
          >
            {actionText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
