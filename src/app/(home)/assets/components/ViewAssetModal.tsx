"use client";

import React from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  StatusBadge,
  Text,
} from "@/components";

import { Asset } from "@/types";
import dayjs from "dayjs";

interface ViewAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewAssetModal = ({
  asset,
  isOpen,
  onClose,
}: ViewAssetModalProps) => {
  if (!asset) return null;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MM-YYYY");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>View Asset</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 text-xl">
              {`${asset.name[0]}`.toUpperCase()}
            </div>
          </div>

          {/* User Details */}
          <div className="p-4 border border-gray-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                First name:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.first_name}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Last name:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.last_name}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Date of birth:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(user.date_of_birth) || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Email address:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.email}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Phone number:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.phone}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Role:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.role}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Country:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.country}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site:
              </Text>
              <Text variant="span" className="text-gray-900">
                {(user.site as string) || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Date added:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(user.created_at_datetime)}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Status:
              </Text>
              <StatusBadge
                status={user.status as "Active" | "Inactive" | "Pending"}
              />
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Organization:
              </Text>
              <Text variant="span" className="text-gray-900">
                {user.organization.name}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Deactivate:
              </Text>
              <div className="flex items-center">
                <div className="relative inline-block w-10 h-6 bg-gray-300 rounded-full transition-colors">
                  <input
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={user.status === "Inactive"}
                  />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline">Edit {user.role}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
