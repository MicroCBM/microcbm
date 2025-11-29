"use client";

import React from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetTrigger,
  SheetFooter,
  ImageUpload,
} from "@/components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  addOrganizationService,
  uploadImage,
  getPresignedUrlService,
} from "@/app/actions";
import { toast } from "sonner";
import { Icon } from "@/libs";
import Input from "@/components/input/Input";
import { ADD_ORGANIZATION_SCHEMA, AddOrganizationPayload } from "@/schema";
import { INDUSTRIES } from "@/helpers";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof ADD_ORGANIZATION_SCHEMA>;

export const AddOrganizationModal = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const router = useRouter();
  const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] =
    React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(
    null
  );
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ADD_ORGANIZATION_SCHEMA),
    mode: "onSubmit",
  });

  const onSubmit = async (data: AddOrganizationPayload) => {
    try {
      const response = await addOrganizationService(data);
      if (response.success) {
        toast.success("Organization created successfully", {
          description: "The organization has been added to your list.",
        });
        reset();
        router.refresh();
        setIsAddOrganizationModalOpen(false);
        setUploadedFileName(null);
      } else {
        toast.error(
          response.message || "Failed to create organization. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to create organization. Please try again."
      );
    }
  };

  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);

    try {
      const response = await uploadImage({ file });

      if (response.success) {
        // Extract filename from response
        const fileKey = response.data?.data?.file_key;

        if (fileKey && typeof fileKey === "string") {
          // Get presigned URL using the uploaded filename
          try {
            const presignedUrlResponse = await getPresignedUrlService(fileKey);
            setUploadedFileName(presignedUrlResponse?.presigned_url);
          } catch (presignedError) {
            console.error("Failed to get presigned URL:", presignedError);
          }
        }

        toast.success("Image uploaded successfully", {
          description: response.data?.message,
        });
        setFile(null);
        router.refresh();
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <>
      <Sheet
        open={isAddOrganizationModalOpen}
        onOpenChange={setIsAddOrganizationModalOpen}
      >
        <SheetTrigger asChild>
          <Button
            onClick={() => setIsAddOrganizationModalOpen(true)}
            size="medium"
            className="rounded-full"
          >
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Add New Organization
          </Button>
        </SheetTrigger>
        <SheetContent className="!max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Add New Organization</SheetTitle>
          </SheetHeader>

          <form
            id="add-organization-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full px-6 overflow-y-auto gap-4"
          >
            <ImageUpload
              file={file}
              onFileChange={setFile}
              onUpload={handleImageUpload}
              isUploading={isUploadingImage}
              currentImageUrl={uploadedFileName || undefined}
            />
            <Input
              label="Organization Name"
              placeholder="Enter organization name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry: string) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="team_strength"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Team Size">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              type="textarea"
              rows={4}
              label="Description"
              placeholder="Describe the organization's description"
              {...register("description")}
              error={errors.description?.message}
            />
          </form>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOrganizationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-organization-form"
              loading={isSubmitting}
            >
              Create Organization
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
