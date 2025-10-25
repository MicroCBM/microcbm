"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Text,
} from "@/components";
import { Icon } from "@/libs";
import { Recommendation } from "@/types";
import dayjs from "dayjs";

interface ViewRecommendationModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewRecommendationModal({
  recommendation,
  isOpen,
  onClose,
}: ViewRecommendationModalProps) {
  if (!recommendation) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recommendation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Text variant="h5" className="text-gray-900 mb-2">
                {recommendation.title}
              </Text>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                    recommendation.severity
                  )}`}
                >
                  {recommendation.severity.charAt(0).toUpperCase() +
                    recommendation.severity.slice(1)}
                </span>
                {recommendation.status && (
                  <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {recommendation.status.replace("_", " ").toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Text variant="h6" className="text-gray-900 mb-2">
              Description
            </Text>
            <Text variant="p" className="text-gray-700">
              {recommendation.description}
            </Text>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text
                variant="span"
                className="text-sm font-medium text-gray-500"
              >
                Site
              </Text>
              <Text variant="p" className="text-gray-900">
                {recommendation.site?.name || recommendation.site?.id || "-"}
              </Text>
            </div>

            <div>
              <Text
                variant="span"
                className="text-sm font-medium text-gray-500"
              >
                Asset
              </Text>
              <Text variant="p" className="text-gray-900">
                {recommendation.asset?.name || recommendation.asset?.id || "-"}
              </Text>
            </div>

            <div>
              <Text
                variant="span"
                className="text-sm font-medium text-gray-500"
              >
                Sampling Point
              </Text>
              <Text variant="p" className="text-gray-900">
                {recommendation.sampling_point?.name ||
                  recommendation.sampling_point?.id ||
                  "-"}
              </Text>
            </div>

            <div>
              <Text
                variant="span"
                className="text-sm font-medium text-gray-500"
              >
                Recommender
              </Text>
              <Text variant="p" className="text-gray-900">
                {recommendation.recommender?.name ||
                  recommendation.recommender?.id ||
                  "-"}
              </Text>
            </div>

            <div>
              <Text
                variant="span"
                className="text-sm font-medium text-gray-500"
              >
                Created
              </Text>
              <Text variant="p" className="text-gray-900">
                {dayjs(recommendation.created_at_datetime).format(
                  "MMM D, YYYY HH:mm"
                )}
              </Text>
            </div>

            <div>
              <Text
                variant="span"
                className="text-sm font-medium text-gray-500"
              >
                Last Updated
              </Text>
              <Text variant="p" className="text-gray-900">
                {dayjs(recommendation.updated_at_datetime).format(
                  "MMM D, YYYY HH:mm"
                )}
              </Text>
            </div>
          </div>

          {/* Attachments */}
          {recommendation.attachments &&
            recommendation.attachments.length > 0 && (
              <div>
                <Text variant="h6" className="text-gray-900 mb-2">
                  Attachments
                </Text>
                <div className="space-y-2">
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
                        className="text-blue-600 hover:text-blue-800 text-sm"
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
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
