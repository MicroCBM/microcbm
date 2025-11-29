"use client";
import React from "react";

import { cn } from "@/libs/utils";

type Props = Readonly<{
  open: boolean;
  children: React.ReactNode;
  className?: string;
}>;

export function Expandable({ open, children, className }: Props) {
  return (
    <div
      className={cn(
        "grid overflow-hidden transition-all duration-300",
        className,
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
}
