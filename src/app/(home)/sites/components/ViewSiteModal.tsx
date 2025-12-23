"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from "@/components";

import { Sites } from "@/types";

interface ViewSiteModalProps {
  site: Sites | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewSiteModal = ({
  site,
  isOpen,
  onClose,
}: ViewSiteModalProps) => {
  if (!site) return null;

  console.log("site", site);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>View Site</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4">
          {/* Site Details */}
          <div className="p-4 border border-gray-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Name:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.name}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Tag:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.tag}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Description:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.description}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Installation Environment:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.installation_environment || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Country:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.country}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                City:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.city}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Address:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.address}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Regulations and Standards:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.regulations_and_standards.join(", ")}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Manager:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.manager_name}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Manager Email:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.manager_email}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Manager Phone Number:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.manager_phone_number}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Site Manager Location:
              </Text>
              <Text variant="span" className="text-gray-900">
                {site.manager_location}
              </Text>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
