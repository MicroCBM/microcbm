"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from "@/components";
import { Department } from "@/types";
import dayjs from "dayjs";

interface ViewDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewDepartmentModal({
  department,
  isOpen,
  onClose,
}: ViewDepartmentModalProps) {
  if (!department) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Department Details</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 h-full overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <div>
                <Text variant="span" className="text-gray-600">
                  Department Name
                </Text>
                <Text variant="p" className="text-gray-900 font-medium">
                  {department.name}
                </Text>
              </div>

              <div>
                <Text variant="span" className="text-gray-600">
                  Organization
                </Text>
                <Text variant="p" className="text-gray-900">
                  {department.organization.name || "-"}
                </Text>
              </div>

              <div>
                <Text variant="span" className="text-gray-600">
                  Created Date
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(department.created_at_datetime).format(
                    "MMMM D, YYYY [at] h:mm A"
                  )}
                </Text>
              </div>

              <div>
                <Text variant="span" className="text-gray-600">
                  Last Updated
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(department.updated_at_datetime).format(
                    "MMMM D, YYYY [at] h:mm A"
                  )}
                </Text>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Text variant="span" className="text-gray-600">
                  Description
                </Text>
                <Text variant="p" className="text-gray-900">
                  {department.description || "No description provided"}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
