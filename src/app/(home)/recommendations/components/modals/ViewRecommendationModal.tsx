"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Text,
  Switch,
} from "@/components";
import { Icon } from "@/libs";
import { Recommendation, Sites, Asset, SamplingPoint } from "@/types";
import dayjs from "dayjs";
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";
import {
  getSiteService,
  getAssetService,
  getSamplingPointService,
  getUserByIdService,
} from "@/app/actions";

export function ViewRecommendationModal() {
  const modal = usePersistedModalState<{ recommendation: Recommendation }>({
    paramName: MODALS.RECOMMENDATION.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.RECOMMENDATION.CHILDREN.VIEW);
  const recommendation = modal.modalData?.recommendation;

  const [site, setSite] = useState<Sites | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [samplingPoint, setSamplingPoint] = useState<SamplingPoint | null>(
    null
  );
  const [recommender, setRecommender] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!recommendation || !isOpen) return;

    const fetchRelatedData = async () => {
      setIsLoading(true);
      try {
        // Fetch all related data in parallel
        const promises = [];

        if (recommendation.site?.id) {
          promises.push(
            getSiteService(recommendation.site.id)
              .then(setSite)
              .catch((error) => {
                console.error("Error fetching site:", error);
                setSite(null);
              })
          );
        }

        if (recommendation.asset?.id) {
          promises.push(
            getAssetService(recommendation.asset.id)
              .then(setAsset)
              .catch((error) => {
                console.error("Error fetching asset:", error);
                setAsset(null);
              })
          );
        }

        if (recommendation.sampling_point?.id) {
          promises.push(
            getSamplingPointService(recommendation.sampling_point.id)
              .then(setSamplingPoint)
              .catch((error) => {
                console.error("Error fetching sampling point:", error);
                setSamplingPoint(null);
              })
          );
        }

        if (recommendation.recommender?.id) {
          promises.push(
            getUserByIdService(recommendation.recommender.id)
              .then((user) => {
                setRecommender({
                  first_name: user.first_name || "",
                  last_name: user.last_name || "",
                  email: user.email || "",
                });
              })
              .catch((error) => {
                console.error("Error fetching recommender:", error);
                setRecommender(null);
              })
          );
        }

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching related data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedData();
  }, [recommendation, isOpen]);

  if (!recommendation || !isOpen) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD-MM-YYYY");
  };

  return (
    <Sheet open={isOpen} onOpenChange={modal.closeModal}>
      <SheetContent className="md:max-w-[580px]">
        <SheetHeader>
          <SheetTitle>Recommendation Details</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex flex-col gap-4 h-screen overflow-y-auto">
          {/* Recommendation Status */}
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <Text
                variant="span"
                weight="medium"
                className="text-gray-700 text-sm"
              >
                Recommendation Status
              </Text>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Severity
                </Text>
                <div className="mt-1">
                  <Switch
                    checked={
                      recommendation.severity === "critical" ||
                      recommendation.severity === "high"
                    }
                    disabled
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                  />
                </div>
              </div>

              {recommendation.status && (
                <div>
                  <Text variant="span" className="text-xs text-gray-500">
                    Status
                  </Text>
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {recommendation.status
                        .replace("_", " ")
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Text variant="span" className="text-xs text-gray-500">
                  Title
                </Text>
                <Text
                  variant="p"
                  className="text-gray-900 font-medium line-clamp-1"
                >
                  {recommendation.title}
                </Text>
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Basic Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Title:
              </Text>
              <Text variant="span" className="text-gray-900">
                {recommendation.title}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Severity:
              </Text>
              <div className="flex items-center gap-2">
                <Switch
                  checked={
                    recommendation.severity === "critical" ||
                    recommendation.severity === "high"
                  }
                  disabled
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                />
                <span className="text-sm text-gray-900">
                  {recommendation.severity.charAt(0).toUpperCase() +
                    recommendation.severity.slice(1)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Text
                variant="span"
                className="text-gray-600 font-medium block mb-2"
              >
                Description:
              </Text>
              <Text variant="span" className="text-gray-900 block">
                {recommendation.description}
              </Text>
            </div>
          </div>

          {/* Location Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Location Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Site:
              </Text>
              <Text variant="span" className="text-gray-900">
                {isLoading
                  ? "Loading..."
                  : site?.name || recommendation.site?.name || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Asset:
              </Text>
              <Text variant="span" className="text-gray-900">
                {isLoading
                  ? "Loading..."
                  : asset?.name || recommendation.asset?.name || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Sampling Point:
              </Text>
              <Text variant="span" className="text-gray-900">
                {isLoading
                  ? "Loading..."
                  : samplingPoint?.name ||
                    recommendation.sampling_point?.name ||
                    "N/A"}
              </Text>
            </div>
          </div>

          {/* Recommendation Information */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Recommendation Information
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Recommender:
              </Text>
              <Text variant="span" className="text-gray-900">
                {isLoading
                  ? "Loading..."
                  : recommender
                  ? `${recommender.first_name} ${recommender.last_name}`.trim() ||
                    recommender.email ||
                    "N/A"
                  : recommendation.recommender?.name || "N/A"}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Status:
              </Text>
              {recommendation.status ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {recommendation.status
                    .replace("_", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              ) : (
                <Text variant="span" className="text-gray-900">
                  N/A
                </Text>
              )}
            </div>
          </div>

          {/* Attachments */}
          {recommendation.attachments &&
            recommendation.attachments.length > 0 && (
              <div className="p-4 border border-gray-100">
                <Text variant="span" weight="medium">
                  Attachments
                </Text>
                <div className="flex flex-col gap-2 pt-2">
                  {recommendation.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 border border-gray-200 rounded"
                    >
                      <Icon
                        icon="mdi:attachment"
                        className="w-4 h-4 text-gray-500"
                      />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex-1"
                      >
                        {attachment.name}
                      </a>
                      <span className="text-xs text-gray-500">
                        ({attachment.type})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Timestamps */}
          <div className="p-4 border border-gray-100">
            <Text variant="span" weight="medium">
              Timestamps
            </Text>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <Text variant="span" className="text-gray-600 font-medium">
                Created:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(recommendation.created_at_datetime)}
              </Text>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Text variant="span" className="text-gray-600 font-medium">
                Last Updated:
              </Text>
              <Text variant="span" className="text-gray-900">
                {formatDate(recommendation.updated_at_datetime)}
              </Text>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={modal.closeModal}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
