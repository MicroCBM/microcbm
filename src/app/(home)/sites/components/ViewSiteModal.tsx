"use client";

import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from "@/components";
import { usePresignedUrl } from "@/hooks";

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
  // Extract site_map file key from attachments
  const siteMapFileKey =
    site?.attachments &&
    Array.isArray(site.attachments) &&
    site.attachments.length > 0
      ? (site.attachments[0] as { site_map?: string })?.site_map
      : null;

  // Get presigned URL for the site map (must be called before early return)
  const { url: siteMapUrl, isLoading: isSiteMapLoading } = usePresignedUrl(
    siteMapFileKey,
    isOpen && !!siteMapFileKey
  );

  if (!site) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="md:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>View Site</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-100px)]">
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
                {site.manager_location || "N/A"}
              </Text>
            </div>
          </div>

          {/* Site Map Attachment */}
          {siteMapFileKey && (
            <div className="p-4 border border-gray-100">
              <Text
                variant="span"
                className="text-gray-600 font-medium mb-4 block"
              >
                Site Map
              </Text>
              {isSiteMapLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Text variant="p" className="text-gray-600 text-sm">
                    Loading image...
                  </Text>
                </div>
              ) : siteMapUrl ? (
                <div className="flex flex-col gap-2">
                  <a
                    href={siteMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Image
                      src={siteMapUrl}
                      alt="Site map"
                      width={500}
                      height={300}
                      className="w-full h-auto rounded-lg border border-gray-200 object-contain"
                      unoptimized
                    />
                  </a>
                  <Text variant="p" className="text-gray-900 text-xs">
                    Site Map Image
                  </Text>
                </div>
              ) : (
                <Text variant="p" className="text-gray-600 text-sm">
                  Unable to load image
                </Text>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
