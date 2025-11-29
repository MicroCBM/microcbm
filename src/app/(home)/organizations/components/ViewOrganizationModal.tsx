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
import type { Organization } from "@/types";
import dayjs from "dayjs";
import { usePresignedUrl } from "@/hooks";
import Image from "next/image";

interface ViewOrganizationModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewOrganizationModal = ({
  organization,
  isOpen,
  onClose,
}: ViewOrganizationModalProps) => {
  const { url: logoUrl, isLoading: isLoadingLogo } = usePresignedUrl(
    organization?.logo_url || null,
    !!organization?.logo_url
  );

  if (!organization) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>View Organization</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center space-y-4">
            {logoUrl && !isLoadingLogo ? (
              <Image
                width={80}
                height={80}
                src={logoUrl}
                alt={organization.name}
                className="w-20 h-20 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 text-xl">
                {organization.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="text-center">
              <Text variant="h6" className="text-gray-900">
                {organization.name}
              </Text>
              <Text variant="p" className="text-gray-600">
                {organization.industry || "N/A"}
              </Text>
            </div>
          </div>

          <div className="p-4 border border-gray-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Team size:
              </Text>
              <Text variant="span" className="text-gray-900">
                {organization.team_strength || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Industry:
              </Text>
              <Text variant="span" className="text-gray-900">
                {organization.industry || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Created:
              </Text>
              <Text variant="span" className="text-gray-900">
                {dayjs(organization.created_at_datetime).format("DD-MM-YYYY")}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Last updated:
              </Text>
              <Text variant="span" className="text-gray-900">
                {dayjs(organization.updated_at_datetime).format("DD-MM-YYYY")}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Description:
              </Text>
              <Text variant="span" className="text-gray-900 text-right">
                {organization.description || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Sites count:
              </Text>
              <Text variant="span" className="text-gray-900">
                {(organization.sites?.length as number) || 0}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Status:
              </Text>
              <StatusBadge status="Active" />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline">Edit Organization</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
