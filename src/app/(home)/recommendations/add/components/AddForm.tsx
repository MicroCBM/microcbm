"use client";
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
import { Sites, Asset, User } from "@/types";
import Input from "@/components/input/Input";
import { Icon } from "@/libs";

type FormData = AddRecommendationPayload;

interface AddFormProps {
  sites: Sites[];
  assets: Asset[];
  users: User[];
}

export const AddForm = ({ sites, assets, users }: AddFormProps) => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_RECOMMENDATION_SCHEMA),
    mode: "onSubmit",
  });

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

            <section className="flex flex-col gap-6 border border-gray-100 p-6">
              {/* here is where you can upload the image */}
              <Input
                type="file"
                label="Upload Image"
                placeholder="Upload image"
              />
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
                      onValueChange={field.onChange}
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
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger label="Asset">
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

              <Input
                label="Sampling Point"
                placeholder="Enter sampling point ID"
                {...register("sampling_point.id")}
                error={errors.sampling_point?.id?.message}
              />

              <Controller
                control={control}
                name="recommender.id"
                render={({ field }) => (
                  <div>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger label="Recommender">
                        <SelectValue placeholder="Select a recommender" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
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
