"use client";
import React from "react";
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Text,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ADD_RECOMMENDATION_SCHEMA, AddRecommendationPayload } from "@/schema";
import { addRecommendationService } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sites, Asset, SamplingPoint } from "@/types";
import Input from "@/components/input/Input";
import { Icon } from "@/libs";

interface USER_TYPE {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  organization: {
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    industry: string;
    logo_url: string;
    members: unknown;
    name: string;
    owner: unknown;
    sites: unknown;
    team_strength: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  password_hash: string;
  phone: string;
  role: string;
  role_id: string | null;
  role_obj: unknown;
  site: {
    address: string;
    attachments: null;
    city: string;
    country: string;
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    installation_environment: string;
    manager_email: string;
    manager_location: string;
    manager_name: string;
    manager_phone_number: string;
    members: unknown;
    name: string;
    organization: unknown;
    regulations_and_standards: unknown;
    tag: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  status: string;
  updated_at: number;
  updated_at_datetime: string;
}

type FormData = AddRecommendationPayload;

interface AddFormProps {
  sites: Sites[];
  assets: Asset[];
  users: USER_TYPE[];
  samplingPoints: SamplingPoint[];
}

export const AddForm = ({
  sites,
  assets,
  users,
  samplingPoints,
}: AddFormProps) => {
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
    resolver: zodResolver(ADD_RECOMMENDATION_SCHEMA),
    mode: "onSubmit",
  });

  const selectedSiteId = watch("site.id");
  const selectedAssetId = watch("asset.id");

  // Filter assets based on selected site
  const filteredAssets = React.useMemo(() => {
    if (!selectedSiteId) return assets;
    return assets.filter((asset) => asset.parent_site?.id === selectedSiteId);
  }, [selectedSiteId, assets]);

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

  // Clear asset and sampling point when site changes
  React.useEffect(() => {
    if (selectedSiteId) {
      // Check if current asset is valid for the selected site
      if (selectedAssetId) {
        const isAssetValid = filteredAssets.some(
          (asset) => asset.id === selectedAssetId
        );
        if (!isAssetValid) {
          setValue("asset.id", "", { shouldValidate: false });
          setValue("sampling_point.id", "", { shouldValidate: false });
        }
      }
    } else {
      // Clear asset and sampling point if no site is selected
      if (selectedAssetId) {
        setValue("asset.id", "", { shouldValidate: false });
      }
      setValue("sampling_point.id", "", { shouldValidate: false });
    }
  }, [selectedSiteId, filteredAssets, selectedAssetId, setValue]);

  // Clear sampling point when asset changes
  const selectedSamplingPointId = watch("sampling_point.id");
  React.useEffect(() => {
    if (selectedAssetId) {
      const isSamplingPointValid = filteredSamplingPoints.some(
        (sp) => sp.id === selectedSamplingPointId
      );
      if (selectedSamplingPointId && !isSamplingPointValid) {
        setValue("sampling_point.id", "", { shouldValidate: false });
      }
    } else {
      if (selectedSamplingPointId) {
        setValue("sampling_point.id", "", { shouldValidate: false });
      }
    }
  }, [
    selectedAssetId,
    filteredSamplingPoints,
    selectedSamplingPointId,
    setValue,
  ]);

  const onSubmit = async (data: AddRecommendationPayload) => {
    console.log("submit data", data);
    try {
      const response = await addRecommendationService(data);
      if (response.success) {
        toast.success("Recommendation created successfully", {
          description: "The recommendation has been added to your list.",
        });
        reset();
        router.push("/recommendations");
      } else {
        console.log("response in add recommendation", response.message);
        toast.error(
          response.message ||
            "Failed to create recommendation. Please try again."
        );
      }
    } catch (error) {
      console.error("error in add recommendation", error);
      toast.error(
        (error as Error).message ||
          "Failed to create recommendation. Please try again."
      );
    }
  };
  return (
    <>
      <section className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 border border-gray-200 flex items-center justify-center"
          >
            <Icon icon="mdi:chevron-left" className=" size-5" />
          </button>

          <Text variant="h6">Add Recommendation</Text>
        </div>
        <div className="flex items-center gap-2">
          <Button size="medium" variant="outline">
            Discard
          </Button>
          <Button size="medium" variant="outline">
            Save Draft
          </Button>
          <Button size="medium">Create Recommendation</Button>
        </div>
      </section>

      <form
        id="add-recommendation-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <section className="flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
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
                    <div>
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
                      {errors.severity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.severity.message}
                        </p>
                      )}
                    </div>
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
          </div>
          <div className="flex flex-col gap-6 border border-gray-100 p-6 max-w-[300px] w-full">
            <Text variant="p">Assets Associated</Text>
            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="site.id"
                render={({ field }) => (
                  <div>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear asset when site changes
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
                    {errors.site?.id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.site.id.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="asset.id"
                render={({ field }) => (
                  <div>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear sampling point when asset changes
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
                    {errors.asset?.id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.asset.id.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="sampling_point.id"
                render={({ field }) => (
                  <div>
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
                          filteredSamplingPoints.map((samplingPoint) => (
                            <SelectItem
                              key={samplingPoint.id}
                              value={samplingPoint.id}
                            >
                              {samplingPoint.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.sampling_point?.id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sampling_point.id.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="recommender.id"
                render={({ field }) => (
                  <div>
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
                    {errors.recommender?.id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.recommender.id.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/recommendations")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create Recommendation
          </Button>
        </div>
      </form>
    </>
  );
};
