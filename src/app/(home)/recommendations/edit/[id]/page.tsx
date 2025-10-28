"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/libs";
import Input from "@/components/input/Input";
import {
  EDIT_RECOMMENDATION_SCHEMA,
  EditRecommendationPayload,
} from "@/schema";
import { Sites, Asset, Recommendation } from "@/types";
import {
  editRecommendationService,
  getRecommendationService,
} from "@/app/actions";
import { toast } from "sonner";

type FormData = EditRecommendationPayload;

export default function EditRecommendationPage() {
  const router = useRouter();
  const params = useParams();
  const recommendationId = params.id as string;

  const [sites, setSites] = React.useState<Sites[]>([]);
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [recommendation, setRecommendation] =
    React.useState<Recommendation | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(EDIT_RECOMMENDATION_SCHEMA),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (recommendationId) {
          // Fetch recommendation data
          const recommendationData = await getRecommendationService(
            recommendationId
          );
          setRecommendation(recommendationData);

          // Reset form with fetched data
          reset({
            title: recommendationData.title,
            severity: recommendationData.severity,
            description: recommendationData.description,
            site: { id: recommendationData.site.id },
            asset: { id: recommendationData.asset.id },
            sampling_point: { id: recommendationData.sampling_point.id },
            recommender: { id: recommendationData.recommender.id },
            attachments: recommendationData.attachments,
          });
        }

        // Fetch sites and assets data
        setSites([]);
        setAssets([]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load recommendation data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recommendationId, reset]);

  const onSubmit = async (data: EditRecommendationPayload) => {
    try {
      const response = await editRecommendationService(recommendationId, data);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Recommendation not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/recommendations")}
            className="mt-4"
          >
            Back to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Recommendation
          </h1>
          <p className="text-gray-600">Update the recommendation details</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/recommendations")}
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Recommendations
        </Button>
      </div>

      <form
        id="edit-recommendation-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Enter detailed description of the recommendation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="site.id"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site
                </label>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset
                </label>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="sampling_point.id"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sampling Point
                </label>
                <Input
                  placeholder="Enter sampling point ID"
                  {...register("sampling_point.id")}
                  error={errors.sampling_point?.id?.message}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="recommender.id"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommender
                </label>
                <Input
                  placeholder="Enter recommender ID"
                  {...register("recommender.id")}
                  error={errors.recommender?.id?.message}
                />
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
    </main>
  );
}
