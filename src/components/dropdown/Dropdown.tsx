import React, { Fragment, type ReactNode } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/libs";
import type { PermissionType } from "@/types";

import { ComponentGuard } from "../content-guard";

type DropdownProps = Readonly<{
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  disabled?: boolean;
  permission?: PermissionType | PermissionType[];
  actions: (
    | { label: string; onClickFn: () => void; className?: string }
    | { label: ReactNode[]; onClickFn: () => void; className?: string }
  )[];
  enableModal?: boolean; // to disable modal mode of dropdown to allow clipboard copy
  contentClassName?: string;
}>;

export function Dropdown({
  children,
  disabled,
  actions,
  enableModal = false,
  side = "bottom",
  align = "center",
  contentClassName,
  permission,
}: DropdownProps) {
  return (
    <AnimatePresence>
      <DropdownMenu.Root modal={enableModal}>
        <DropdownMenu.Trigger
          disabled={disabled}
          className="rounded-lg outline-none "
          data-testid={"menu-btn"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <div>
            <DropdownMenu.Content
              side={side}
              sideOffset={5}
              align={align}
              asChild
              className={contentClassName}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="p-1 max-h-[50vh] z-[999] overflow-y-auto no-scrollbar rounded-xl min-w-[144px] flex flex-col bg-white border-1 border-gray-100 gap-1 shadow-[0px_15px_40px_0px_rgba(0,0,0,_0.04)] no-print"
              >
                {actions.map(({ label, onClickFn, className }) => (
                  <ComponentGuard
                    key={
                      typeof label === "string"
                        ? label
                        : label
                            .filter((item) => typeof item === "string")
                            .join("")
                    }
                    permissions={permission}
                  >
                    <DropdownMenu.Item
                      className={cn(
                        "flex items-center gap-3 p-3 py-2 text-xs rounded-lg min-w-[116px] outline-none text-gray-500 hover:outline-none hover:cursor-pointer hover:bg-gray-50 leading-[20px]",
                        className
                      )}
                      onSelect={onClickFn}
                      data-testid="dropdown-menu-item"
                    >
                      {typeof label === "string" ? label : null}
                      {Array.isArray(label)
                        ? label.map((item, index) => (
                            <Fragment key={index}>{item}</Fragment>
                          ))
                        : null}
                    </DropdownMenu.Item>
                  </ComponentGuard>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </div>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </AnimatePresence>
  );
}
