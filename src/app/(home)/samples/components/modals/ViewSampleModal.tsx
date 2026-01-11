"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Text,
  Button,
} from "@/components";
import { Sample, Sites, Asset, SamplingPoint } from "@/types";
import dayjs from "dayjs";
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";
import {
  getSiteService,
  getAssetService,
  getSamplingPointService,
} from "@/app/actions";

export function ViewSampleModal() {
  const modal = usePersistedModalState<{ sample: Sample }>({
    paramName: MODALS.SAMPLE.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.SAMPLE.CHILDREN.VIEW);
  const sample = modal.modalData?.sample;

  const [fetchedSite, setFetchedSite] = useState<Sites | null>(null);
  const [fetchedAsset, setFetchedAsset] = useState<Asset | null>(null);
  const [fetchedSamplingPoint, setFetchedSamplingPoint] =
    useState<SamplingPoint | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    if (isOpen && sample) {
      setIsLoadingDetails(true);
      const fetchData = async () => {
        try {
          const [siteData, assetData, samplingPointData] = await Promise.all([
            sample.site?.id
              ? getSiteService(sample.site.id)
              : Promise.resolve(null),
            sample.asset?.id
              ? getAssetService(sample.asset.id)
              : Promise.resolve(null),
            sample.sampling_point?.id
              ? getSamplingPointService(sample.sampling_point.id)
              : Promise.resolve(null),
          ]);

          setFetchedSite(siteData);
          setFetchedAsset(assetData);
          setFetchedSamplingPoint(samplingPointData);
        } catch (error) {
          console.error("Failed to fetch sample details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchData();
    } else {
      setFetchedSite(null);
      setFetchedAsset(null);
      setFetchedSamplingPoint(null);
      setIsLoadingDetails(true);
    }
  }, [isOpen, sample]);

  if (!sample || !isOpen) return null;

  const siteName = isLoadingDetails
    ? "Loading..."
    : fetchedSite?.name || sample.site?.name || "N/A";
  const assetName = isLoadingDetails
    ? "Loading..."
    : fetchedAsset?.name || sample.asset?.name || "N/A";
  const samplingPointName = isLoadingDetails
    ? "Loading..."
    : fetchedSamplingPoint?.name || sample.sampling_point?.name || "N/A";

  return (
    <Sheet open={isOpen} onOpenChange={modal.closeModal}>
      <SheetContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Sample Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Sample Header */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Text variant="h6" className="text-gray-900">
                {sample.serial_number}
              </Text>
              <Text variant="p" className="text-gray-600">
                Lab: {sample.lab_name}
              </Text>
              <Text variant="p" className="text-sm text-gray-500">
                Severity: <span className="capitalize">{sample.severity}</span>
              </Text>
            </div>
          </div>

          {/* Sample Details */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Serial Number
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.serial_number}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Date Sampled
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs.unix(sample.date_sampled).format("MMM D, YYYY HH:mm")}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Site
                </Text>
                <Text variant="p" className="text-gray-900">
                  {siteName}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Asset
                </Text>
                <Text variant="p" className="text-gray-900">
                  {assetName}
                </Text>
              </div>
            </div>

            <div>
              <Text variant="span" className="text-gray-700">
                Sampling Point
              </Text>
              <Text variant="p" className="text-gray-900">
                {samplingPointName}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Lab Name
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.lab_name}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Severity
                </Text>
                <Text variant="p" className="capitalize text-gray-900">
                  {sample.severity}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Service Meter Reading
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.service_meter_reading}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Hours
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.hrs}
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="span" className="text-gray-700">
                  Oil in Service (hours)
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.oil_in_service}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Filter Changed
                </Text>
                <Text variant="p" className="text-gray-900">
                  {sample.filter_changed}
                </Text>
              </div>
            </div>

            <div>
              <Text variant="span" className="text-gray-700">
                Oil Drained
              </Text>
              <Text variant="p" className="text-gray-900">
                {sample.oil_drained}
              </Text>
            </div>

            {/* Wear Metals */}
            {sample.wear_metals && sample.wear_metals.length > 0 && (
              <div>
                <Text variant="span" className="text-gray-700 font-semibold">
                  Wear Metals
                </Text>
                <div className="mt-2 space-y-2">
                  {sample.wear_metals.map((metal, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 p-2 bg-gray-50 rounded"
                    >
                      <Text variant="span" className="capitalize">
                        {metal.element}
                      </Text>
                      <Text variant="span">
                        {metal.value} {metal.unit}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contaminants */}
            {sample.contaminants && sample.contaminants.length > 0 && (
              <div>
                <Text variant="span" className="text-gray-700 font-semibold">
                  Contaminants
                </Text>
                <div className="mt-2 space-y-2">
                  {sample.contaminants.map((contaminant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 p-2 bg-gray-50 rounded"
                    >
                      <Text variant="span" className="capitalize">
                        {contaminant.type}
                      </Text>
                      <Text variant="span">
                        {contaminant.value} {contaminant.unit}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Text variant="span" className="text-gray-700">
                  Created
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(sample.created_at_datetime).format("MMM D, YYYY")}
                </Text>
              </div>
              <div>
                <Text variant="span" className="text-gray-700">
                  Last Updated
                </Text>
                <Text variant="p" className="text-gray-900">
                  {dayjs(sample.updated_at_datetime).format("MMM D, YYYY")}
                </Text>
              </div>
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
