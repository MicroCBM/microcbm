"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/libs";
import Input from "@/components/input/Input";
import {
  EDIT_RECOMMENDATION_SCHEMA,
  EditRecommendationPayload,
} from "@/schema";
import { Sites, Asset, Recommendation, SamplingPoint } from "@/types";
import { editRecommendationService } from "@/app/actions";
import { toast } from "sonner";

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

interface EditRecommendationFormProps {
  recommendation: Recommendation;
  sites: Sites[];
  assets: Asset[];
  users: USER_TYPE[];
  samplingPoints: SamplingPoint[];
}

export function EditRecommendationForm({
  recommendation,
  sites,
  assets,
  users,
  samplingPoints,
}: EditRecommendationFormProps) {
  const router = useRouter();

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

  // Reset form when recommendation data changes
  React.useEffect(() => {
    if (recommendation) {
      reset({
        title: recommendation.title,
        severity: recommendation.severity,
        description: recommendation.description,
        site: { id: recommendation.site.id },
        asset: { id: recommendation.asset.id },
        sampling_point: { id: recommendation.sampling_point.id },
        recommender: { id: recommendation.recommender.id },
        attachments: recommendation.attachments,
      });
    }
  }, [recommendation, reset]);

  const selectedSiteId = watch("site.id");
  const selectedAssetId = watch("asset.id");

  // Filter assets based on selected site, but always include the current asset
  const filteredAssets = React.useMemo(() => {
    if (!selectedSiteId) return assets;
    const filtered = assets.filter((asset) => asset.parent_site?.id === selectedSiteId);
    // Always include current asset if it exists, even if it doesn't match filter
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
        (sp) => sp.site?.id === selectedSiteId
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
  React.useEffect(() => {
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
    try {
      const response = await editRecommendationService(
        recommendation.id,
        data
      );
      if (response.success) {
        toast.success("Recommendation updated successfully", {
          description: "The recommendation has been updated.",
        });
        router.push("/recommendations");
      } else {
        toast.error(
          response.message ||
            "Failed to update recommendation. Please try again."
        );
      }
    } catch (error) {
      console.error("error in edit recommendation", error);
      toast.error(
        (error as Error).message ||
          "Failed to update recommendation. Please try again."
      );
    }
  };

  return (
    <>
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 border border-gray-200 flex items-center justify-center"
          >
            <Icon icon="mdi:chevron-left" className=" size-5" />
          </button>

          <Text variant="h6">Edit Recommendation</Text>
        </div>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[827.8px] flex flex-col gap-4"
      >
        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Basic Information</Text>
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
          <Text variant="p">Location Information</Text>
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="site.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Clear asset when site changes
                    setValue("asset.id", "", { shouldValidate: false });
                  }}
                >
                  <SelectTrigger className="col-span-full" label="Site">
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
                    // Clear sampling point when asset changes
                    setValue("sampling_point.id", "", { shouldValidate: false });
                  }}
                  disabled={!selectedSiteId || filteredAssets.length === 0}
                >
                  <SelectTrigger
                    className="col-span-full"
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
                    className="col-span-full"
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
          <Text variant="p">Recommendation Information</Text>
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
                    className="col-span-full"
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

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/recommendations")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Update Recommendation
          </Button>
        </div>
      </form>
    </>
  );
}

