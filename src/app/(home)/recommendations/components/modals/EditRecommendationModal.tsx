"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Text,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/input/Input";
import {
  EDIT_RECOMMENDATION_SCHEMA,
  EditRecommendationPayload,
} from "@/schema";
import { Sites, Asset, Recommendation, SamplingPoint } from "@/types";
import {
  editRecommendationService,
  getRecommendationService,
  getSitesService,
  getAssetsService,
  getUsersService,
  getSamplingPointsService,
} from "@/app/actions";
import { toast } from "sonner";
import { usePersistedModalState } from "@/hooks";
import { MODALS } from "@/utils/constants/modals";

interface USER_TYPE {
  id: string;
  first_name: string;
  last_name: string;
  organization?: {
    id: string;
  };
  site?: {
    id: string;
  };
}

type FormData = EditRecommendationPayload;

export function EditRecommendationModal() {
  const router = useRouter();
  const modal = usePersistedModalState<{ recommendation: Recommendation }>({
    paramName: MODALS.RECOMMENDATION.PARAM_NAME,
  });

  const isOpen = modal.isModalOpen(MODALS.RECOMMENDATION.CHILDREN.EDIT);
  const recommendationFromModal = modal.modalData?.recommendation;

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [sites, setSites] = useState<Sites[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<USER_TYPE[]>([]);
  const [samplingPoints, setSamplingPoints] = useState<SamplingPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(EDIT_RECOMMENDATION_SCHEMA),
    mode: "onSubmit",
  });

  // Fetch recommendation and related data when modal opens
  useEffect(() => {
    if (!isOpen || !recommendationFromModal?.id) return;

    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        // Fetch all data in parallel
        const [
          recommendationData,
          sitesData,
          assetsData,
          usersData,
          samplingPointsData,
        ] = await Promise.all([
          getRecommendationService(recommendationFromModal.id),
          getSitesService(),
          getAssetsService(),
          getUsersService(),
          getSamplingPointsService(),
        ]);

        setRecommendation(recommendationData);
        setSites(sitesData);
        setAssets(assetsData);
        setUsers(usersData as USER_TYPE[]);
        setSamplingPoints(samplingPointsData);

        // Reset form with recommendation data
        reset({
          title: recommendationData.title,
          severity: recommendationData.severity,
          description: recommendationData.description,
          site: { id: recommendationData.site?.id || "" },
          asset: { id: recommendationData.asset?.id || "" },
          sampling_point: { id: recommendationData.sampling_point?.id || "" },
          recommender: { id: recommendationData.recommender?.id || "" },
          attachments: recommendationData.attachments || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load recommendation data");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [isOpen, recommendationFromModal?.id, reset]);

  const selectedSiteId = watch("site.id");
  const selectedAssetId = watch("asset.id");

  // Filter assets based on selected site
  const filteredAssets = React.useMemo(() => {
    if (!selectedSiteId) return assets;
    const filtered = assets.filter(
      (asset) => asset.parent_site?.id === selectedSiteId
    );
    // Always include current asset if it exists
    if (selectedAssetId && !filtered.some((a) => a.id === selectedAssetId)) {
      const currentAsset = assets.find((a) => a.id === selectedAssetId);
      if (currentAsset) filtered.unshift(currentAsset);
    }
    return filtered;
  }, [selectedSiteId, selectedAssetId, assets]);

  // Filter sampling points based on selected site and asset
  const filteredSamplingPoints = React.useMemo(() => {
    let filtered = samplingPoints;
    if (selectedSiteId) {
      filtered = filtered.filter(
        (sp) => sp.parent_asset?.parent_site?.id === selectedSiteId
      );
    }
    if (selectedAssetId) {
      filtered = filtered.filter(
        (sp) => sp.parent_asset?.id === selectedAssetId
      );
    }
    return filtered;
  }, [selectedSiteId, selectedAssetId, samplingPoints]);

  // Filter users based on selected site
  const filteredUsers = React.useMemo(() => {
    if (!selectedSiteId) return users;
    return users.filter((user) => user.site?.id === selectedSiteId);
  }, [selectedSiteId, users]);

  // Clear asset if current asset is not in filtered list when site changes
  useEffect(() => {
    if (selectedSiteId && selectedAssetId) {
      const isAssetValid = filteredAssets.some(
        (asset) => asset.id === selectedAssetId
      );
      if (!isAssetValid) {
        setValue("asset.id", "", { shouldValidate: false });
      }
    } else if (!selectedSiteId && selectedAssetId) {
      setValue("asset.id", "", { shouldValidate: false });
    }
  }, [selectedSiteId, filteredAssets, selectedAssetId, setValue]);

  const onSubmit = async (data: EditRecommendationPayload) => {
    if (!recommendation) return;

    setIsLoading(true);
    try {
      const response = await editRecommendationService(recommendation.id, data);
      if (response.success) {
        toast.success("Recommendation updated successfully", {
          description: "The recommendation has been updated.",
        });
        modal.closeModal();
        router.refresh();
      } else {
        toast.error(
          response.message ||
            "Failed to update recommendation. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating recommendation:", error);
      toast.error(
        (error as Error).message ||
          "Failed to update recommendation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={modal.closeModal}>
      <SheetContent className="md:max-w-[827.8px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Recommendation</SheetTitle>
        </SheetHeader>

        {isFetchingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 pt-6"
          >
            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p" weight="medium">
                Basic Information
              </Text>
              <div className="flex flex-col gap-4">
                <Input
                  label="Title"
                  placeholder="Enter recommendation title"
                  {...register("title")}
                  error={errors.title?.message}
                />

                <Controller
                  control={control}
                  name="severity"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger label="Severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Input
                  label="Description"
                  placeholder="Enter detailed description of the recommendation"
                  type="textarea"
                  rows={4}
                  {...register("description")}
                  error={errors.description?.message}
                />
              </div>
            </section>

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p" weight="medium">
                Location Information
              </Text>
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="site.id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("asset.id", "", { shouldValidate: false });
                      }}
                    >
                      <SelectTrigger label="Site">
                        <SelectValue placeholder="Select a site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="asset.id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("sampling_point.id", "", {
                          shouldValidate: false,
                        });
                      }}
                      disabled={!selectedSiteId || filteredAssets.length === 0}
                    >
                      <SelectTrigger
                        label="Asset"
                        error={errors.asset?.id?.message}
                      >
                        <SelectValue
                          placeholder={
                            !selectedSiteId
                              ? "Select a site first"
                              : filteredAssets.length === 0
                              ? "No assets available for this site"
                              : "Select an asset"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAssets.length > 0 &&
                          filteredAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="sampling_point.id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={
                        !selectedSiteId ||
                        !selectedAssetId ||
                        filteredSamplingPoints.length === 0
                      }
                    >
                      <SelectTrigger
                        label="Sampling Point"
                        error={errors.sampling_point?.id?.message}
                      >
                        <SelectValue
                          placeholder={
                            !selectedSiteId
                              ? "Select a site first"
                              : !selectedAssetId
                              ? "Select an asset first"
                              : filteredSamplingPoints.length === 0
                              ? "No sampling points available"
                              : "Select a sampling point"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSamplingPoints.length > 0 &&
                          filteredSamplingPoints.map((sp) => (
                            <SelectItem key={sp.id} value={sp.id}>
                              {sp.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </section>

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              <Text variant="p" weight="medium">
                Recommendation Information
              </Text>
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="recommender.id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={!selectedSiteId || filteredUsers.length === 0}
                    >
                      <SelectTrigger
                        label="Recommender"
                        error={errors.recommender?.id?.message}
                      >
                        <SelectValue
                          placeholder={
                            !selectedSiteId
                              ? "Select a site first"
                              : filteredUsers.length === 0
                              ? "No users available for this site"
                              : "Select a recommender"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUsers.length > 0 &&
                          filteredUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name} {user.last_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </section>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={modal.closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading || isSubmitting}
                disabled={isLoading || isSubmitting}
              >
                Update Recommendation
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
