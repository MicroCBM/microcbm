"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Text,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { EditSamplePayload, EDIT_SAMPLE_SCHEMA } from "@/schema";
import { editSampleService } from "@/app/actions";
import { Sample, Sites, Asset, SamplingPoint } from "@/types";
import Input from "@/components/input/Input";
import dayjs from "dayjs";
import { z } from "zod";

// Form type that allows date_sampled as string (for datetime-local input)
// and objects for nested arrays (contaminants, particle_counts, viscosity_levels)
type EditSampleFormData = Omit<
  EditSamplePayload,
  "date_sampled" | "contaminants" | "particle_counts" | "viscosity_levels"
> & {
  date_sampled: string | number;
  contaminants?:
    | Record<string, string>
    | Array<{ type: string; value: number; unit: string }>;
  particle_counts?:
    | Record<string, string>
    | Array<{ size_range: string; count: number; unit: string }>;
  viscosity_levels?:
    | Record<string, string>
    | Array<{ temperature: number; viscosity: number; unit: string }>;
};

const SEVERITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "urgent", label: "Urgent" },
];

const YES_NO_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const METALS = [
  { key: "iron", label: "Iron (Fe)", symbol: "Fe" },
  { key: "aluminum", label: "Aluminum (Al)", symbol: "Al" },
  { key: "silver", label: "Silver (Ag)", symbol: "Ag" },
  { key: "chromium", label: "Chromium (Cr)", symbol: "Cr" },
  { key: "copper", label: "Copper (Cu)", symbol: "Cu" },
  { key: "lead", label: "Lead (Pb)", symbol: "Pb" },
  { key: "nickel", label: "Nickel (Ni)", symbol: "Ni" },
  { key: "tin", label: "Tin (Sn)", symbol: "Sn" },
  { key: "titanium", label: "Titanium (Ti)", symbol: "Ti" },
  { key: "pq_index", label: "PQ Index", symbol: "PQ" },
];

const CONTAMINANTS = [
  { key: "silicon", label: "Silicon (Si)", symbol: "Si" },
  { key: "sodium", label: "Sodium (Na)", symbol: "Na" },
  { key: "potassium", label: "Potassium (K)", symbol: "K" },
  { key: "water", label: "Water", symbol: "H₂O" },
  { key: "total_acid_number", label: "Total Acid Number", symbol: "TAN" },
];

const PARTICLE_COUNTS = [
  { key: "4_micron", label: "4 Micron", symbol: "4 µm" },
  { key: "8_micron", label: "8 Micron", symbol: "8 µm" },
  { key: "14_micron", label: "14 Micron", symbol: "14 µm" },
  { key: "20_micron", label: "20 Micron", symbol: "20 µm" },
  { key: "25_micron", label: "25 Micron", symbol: "25 µm" },
  { key: "50_micron", label: "50 Micron", symbol: "50 µm" },
  { key: "75_micron", label: "75 Micron", symbol: "75 µm" },
  { key: "100_micron", label: "100 Micron", symbol: "100 µm" },
];

const VISCOSITY_LEVELS = [
  { key: "40_cst", label: "Viscosity @ 40°C", symbol: "40 cSt" },
  { key: "100_cst", label: "Viscosity @ 100°C", symbol: "100 cSt" },
];

const ADDITIVES = [
  { key: "magnesium", label: "Magnesium (Mg)", symbol: "Mg" },
  { key: "calcium", label: "Calcium (Ca)", symbol: "Ca" },
  { key: "molybdenum", label: "Molybdenum (Mo)", symbol: "Mo" },
  { key: "zinc", label: "Zinc (Zn)", symbol: "Zn" },
  { key: "phosphorus", label: "Phosphorus (P)", symbol: "P" },
  { key: "sulfur", label: "Sulfur (S)", symbol: "S" },
  { key: "boron", label: "Boron (B)", symbol: "B" },
];

interface EditSampleFormProps {
  sample: Sample;
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}

export function EditSampleForm({
  sample,
  sites,
  assets,
  samplingPoints,
}: EditSampleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a form-specific schema that allows date_sampled as string
  // and accepts objects for nested arrays (contaminants, particle_counts, viscosity_levels)
  const formSchema = EDIT_SAMPLE_SCHEMA.extend({
    date_sampled: z.union([z.string(), z.number()]),
    contaminants: z
      .union([
        z.record(z.string(), z.string()),
        z.array(
          z.object({
            type: z.string(),
            value: z.number(),
            unit: z.string(),
          })
        ),
      ])
      .optional(),
    particle_counts: z
      .union([
        z.record(z.string(), z.string()),
        z.array(
          z.object({
            size_range: z.string(),
            count: z.number(),
            unit: z.string(),
          })
        ),
      ])
      .optional(),
    viscosity_levels: z
      .union([
        z.record(z.string(), z.string()),
        z.array(
          z.object({
            temperature: z.number(),
            viscosity: z.number(),
            unit: z.string(),
          })
        ),
      ])
      .optional(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EditSampleFormData>({
    resolver: zodResolver(formSchema),
  });

  console.log("errors", errors);

  useEffect(() => {
    if (sample) {
      // Convert Unix timestamp to datetime-local format
      const dateSampled = dayjs
        .unix(sample.date_sampled)
        .format("YYYY-MM-DDTHH:mm");

      // Convert wear_metals array to object format
      const wearMetalsObj: Record<string, string> = {};
      if (sample.wear_metals && Array.isArray(sample.wear_metals)) {
        sample.wear_metals.forEach((metal) => {
          if (metal.element && metal.value !== undefined) {
            wearMetalsObj[metal.element] = String(metal.value);
          }
        });
      }

      // Convert contaminants array to object format
      const contaminantsObj: Record<string, string> = {};
      if (sample.contaminants && Array.isArray(sample.contaminants)) {
        sample.contaminants.forEach((contaminant) => {
          if (contaminant.type && contaminant.value !== undefined) {
            contaminantsObj[contaminant.type] = String(contaminant.value);
          }
        });
      }

      // Convert particle_counts array to object format
      const particleCountsObj: Record<string, string> = {};
      const particleSizeMapReverse: Record<string, string> = {
        "4-6um": "4_micron",
        "6-10um": "8_micron",
        "10-14um": "14_micron",
        "14-20um": "20_micron",
        "20-25um": "25_micron",
        "25-50um": "50_micron",
        "50-75um": "75_micron",
        "75-100um": "100_micron",
      };
      if (sample.particle_counts && Array.isArray(sample.particle_counts)) {
        sample.particle_counts.forEach((particle) => {
          if (particle.size_range && particle.count !== undefined) {
            const key =
              particleSizeMapReverse[particle.size_range] ||
              particle.size_range.replace(/-/g, "_").toLowerCase();
            particleCountsObj[key] = String(particle.count);
          }
        });
      }

      // Convert viscosity_levels array to object format
      const viscosityLevelsObj: Record<string, string> = {};
      if (sample.viscosity_levels && Array.isArray(sample.viscosity_levels)) {
        sample.viscosity_levels.forEach((viscosity) => {
          if (
            viscosity.temperature !== undefined &&
            viscosity.viscosity !== undefined
          ) {
            const key = `${viscosity.temperature}_cst`;
            viscosityLevelsObj[key] = String(viscosity.viscosity);
          }
        });
      }

      // Convert additives array to object format
      const additivesObj: Record<string, string> = {};
      const sampleWithAdditives = sample as Sample & {
        additives?: Array<{ additive: string; value: string }>;
      };
      if (
        sampleWithAdditives.additives &&
        Array.isArray(sampleWithAdditives.additives)
      ) {
        sampleWithAdditives.additives.forEach((additive) => {
          if (additive.additive && additive.value) {
            // Extract the additive name (e.g., "Magnesium (Mg)" -> "magnesium")
            const additiveName = additive.additive
              .toLowerCase()
              .split("(")[0]
              .trim();
            // Extract numeric value from string like "12 ppm" -> "12"
            const numericValue = additive.value
              .replace(/\s*ppm\s*/gi, "")
              .trim();
            additivesObj[additiveName] = numericValue;
          }
        });
      }

      reset({
        site: { id: sample.site?.id || "" },
        asset: { id: sample.asset?.id || "" },
        sampling_point: { id: sample.sampling_point?.id || "" },
        serial_number: sample.serial_number,
        date_sampled: dateSampled,
        lab_name: sample.lab_name,
        service_meter_reading: sample.service_meter_reading,
        hrs: sample.hrs,
        oil_in_service: sample.oil_in_service,
        filter_changed: sample.filter_changed ? "Yes" : "No",
        oil_drained: sample.oil_drained ? "Yes" : "No",
        severity: sample.severity,
        wear_metals:
          Object.keys(wearMetalsObj).length > 0 ? wearMetalsObj : undefined,
        contaminants:
          Object.keys(contaminantsObj).length > 0
            ? (contaminantsObj as unknown as EditSamplePayload["contaminants"])
            : undefined,
        particle_counts:
          Object.keys(particleCountsObj).length > 0
            ? (particleCountsObj as unknown as EditSamplePayload["particle_counts"])
            : undefined,
        viscosity_levels:
          Object.keys(viscosityLevelsObj).length > 0
            ? (viscosityLevelsObj as unknown as EditSamplePayload["viscosity_levels"])
            : undefined,
        additives:
          Object.keys(additivesObj).length > 0 ? additivesObj : undefined,
      });
    }
  }, [sample, reset]);

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

  // Filter sampling points by selected asset
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
    // Always include current sampling point if it exists
    const currentSamplingPointId = sample.sampling_point?.id;
    if (
      currentSamplingPointId &&
      !filtered.some((sp) => sp.id === currentSamplingPointId)
    ) {
      const currentSamplingPoint = samplingPoints.find(
        (sp) => sp.id === currentSamplingPointId
      );
      if (currentSamplingPoint) filtered.unshift(currentSamplingPoint);
    }
    return filtered;
  }, [
    selectedSiteId,
    selectedAssetId,
    samplingPoints,
    sample.sampling_point?.id,
  ]);

  // Clear dependent fields when parent selections change
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

  useEffect(() => {
    if (selectedSiteId && selectedAssetId) {
      const currentSamplingPointId = watch("sampling_point.id");
      if (currentSamplingPointId) {
        const isSamplingPointValid = filteredSamplingPoints.some(
          (sp) => sp.id === currentSamplingPointId
        );
        if (!isSamplingPointValid) {
          setValue("sampling_point.id", "", { shouldValidate: false });
        }
      }
    } else if (
      (!selectedSiteId || !selectedAssetId) &&
      watch("sampling_point.id")
    ) {
      setValue("sampling_point.id", "", { shouldValidate: false });
    }
  }, [
    selectedSiteId,
    selectedAssetId,
    filteredSamplingPoints,
    setValue,
    watch,
  ]);

  const onSubmit = async (data: EditSampleFormData) => {
    setIsSubmitting(true);
    try {
      // Convert date to Unix timestamp
      const dateSampled = dayjs(data.date_sampled as unknown as string).unix();

      // Transform wear metals object into array format
      const wearMetalsArray: Array<{
        element: string;
        value: number;
        unit: string;
      }> = [];

      if (data.wear_metals && typeof data.wear_metals === "object") {
        METALS.forEach((metal) => {
          const value = (data.wear_metals as Record<string, string>)?.[
            metal.key
          ];
          if (value !== undefined && value !== null && value !== "") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              wearMetalsArray.push({
                element: metal.key,
                value: numValue,
                unit: "ppm",
              });
            }
          }
        });
      }

      // Transform contaminants object into array format
      const contaminantsArray: Array<{
        type: string;
        value: number;
        unit: string;
      }> = [];

      const contaminantsData = data.contaminants as
        | Record<string, string>
        | Array<{ type: string; value: number; unit: string }>
        | undefined;

      if (contaminantsData) {
        if (Array.isArray(contaminantsData)) {
          contaminantsArray.push(...contaminantsData);
        } else if (typeof contaminantsData === "object") {
          CONTAMINANTS.forEach((contaminant) => {
            const value = contaminantsData[contaminant.key];
            if (value !== undefined && value !== null && value !== "") {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                contaminantsArray.push({
                  type: contaminant.key,
                  value: numValue,
                  unit: "ppm",
                });
              }
            }
          });
        }
      }

      // Transform particle_counts object into array format
      const particleCountsArray: Array<{
        size_range: string;
        count: number;
        unit: string;
      }> = [];

      const particleSizeMap: Record<string, string> = {
        "4_micron": "4-6um",
        "8_micron": "6-10um",
        "14_micron": "10-14um",
        "20_micron": "14-20um",
        "25_micron": "20-25um",
        "50_micron": "25-50um",
        "75_micron": "50-75um",
        "100_micron": "75-100um",
      };

      const particleCountsData = data.particle_counts as
        | Record<string, string>
        | Array<{ size_range: string; count: number; unit: string }>
        | undefined;

      if (particleCountsData) {
        if (Array.isArray(particleCountsData)) {
          particleCountsArray.push(...particleCountsData);
        } else if (typeof particleCountsData === "object") {
          PARTICLE_COUNTS.forEach((particle) => {
            const value = particleCountsData[particle.key];
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              particleSizeMap[particle.key]
            ) {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                particleCountsArray.push({
                  size_range: particleSizeMap[particle.key],
                  count: numValue,
                  unit: "particles/ml",
                });
              }
            }
          });
        }
      }

      // Transform viscosity_levels object into array format
      const viscosityLevelsArray: Array<{
        temperature: number;
        viscosity: number;
        unit: string;
      }> = [];

      const viscosityTempMap: Record<string, number> = {
        "40_cst": 40,
        "100_cst": 100,
      };

      const viscosityLevelsData = data.viscosity_levels as
        | Record<string, string>
        | Array<{ temperature: number; viscosity: number; unit: string }>
        | undefined;

      if (viscosityLevelsData) {
        if (Array.isArray(viscosityLevelsData)) {
          viscosityLevelsArray.push(...viscosityLevelsData);
        } else if (typeof viscosityLevelsData === "object") {
          VISCOSITY_LEVELS.forEach((viscosity) => {
            const value = viscosityLevelsData[viscosity.key];
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              viscosityTempMap[viscosity.key]
            ) {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                viscosityLevelsArray.push({
                  temperature: viscosityTempMap[viscosity.key],
                  viscosity: numValue,
                  unit: "cSt",
                });
              }
            }
          });
        }
      }

      // Transform additives object into array format
      const additivesArray: Array<{
        additive: string;
        value: string;
      }> = [];

      if (data.additives && typeof data.additives === "object") {
        ADDITIVES.forEach((additive) => {
          const value = (data.additives as Record<string, string>)?.[
            additive.key
          ];
          if (value !== undefined && value !== null && value !== "") {
            additivesArray.push({
              additive: additive.key,
              value: value,
            });
          }
        });
      }

      const filterChanged =
        typeof data.filter_changed === "string"
          ? data.filter_changed.toLowerCase() === "yes"
          : data.filter_changed === true;
      const oilDrained =
        typeof data.oil_drained === "string"
          ? data.oil_drained.toLowerCase() === "yes"
          : data.oil_drained === true;

      const payload = {
        site: data.site,
        asset: data.asset,
        sampling_point: data.sampling_point,
        serial_number: data.serial_number,
        date_sampled: dateSampled,
        lab_name: data.lab_name,
        service_meter_reading: data.service_meter_reading,
        hrs: data.hrs,
        oil_in_service: data.oil_in_service,
        filter_changed: filterChanged,
        oil_drained: oilDrained,
        severity: data.severity,
        ...(wearMetalsArray.length > 0 && { wear_metals: wearMetalsArray }),
        ...(contaminantsArray.length > 0 && {
          contaminants: contaminantsArray,
        }),
        ...(particleCountsArray.length > 0 && {
          particle_counts: particleCountsArray,
        }),
        ...(viscosityLevelsArray.length > 0 && {
          viscosity_levels: viscosityLevelsArray,
        }),
        ...(additivesArray.length > 0 && { additives: additivesArray }),
        collection_date: dayjs(
          data.date_sampled as unknown as string
        ).toISOString(),
      };

      const response = await editSampleService(
        sample.id,
        payload as unknown as EditSamplePayload
      );
      if (response.success) {
        toast.success("Sample updated successfully", {
          description: "The sample has been updated.",
        });
        router.push("/samples");
      } else {
        toast.error(
          response.message || "Failed to update sample. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to update sample. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/samples");
  };

  if (!sample) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Text variant="h4" className="text-gray-900">
          Edit Sample
        </Text>
        <Text variant="p" className="text-gray-600">
          Update the details of the sample
        </Text>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border border-gray-200 p-6"
      >
        {/* Basic Information */}
        <section className="space-y-4">
          <Text variant="h6" className="text-gray-900 mb-4">
            Basic Information
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Site */}
            <Controller
              control={control}
              name="site.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("asset.id", "", { shouldValidate: false });
                    setValue("sampling_point.id", "", {
                      shouldValidate: false,
                    });
                  }}
                >
                  <SelectTrigger
                    label="Site *"
                    error={errors.site?.id?.message}
                  >
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name || site.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Asset */}
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
                    label="Asset *"
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
                          {asset.name || asset.id}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Sampling Point */}
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
                    label="Sampling Point *"
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
                    {filteredSamplingPoints.length > 0 ? (
                      filteredSamplingPoints.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id}>
                          {sp.name || sp.id}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-sp" disabled>
                        {!selectedSiteId
                          ? "Select a site first"
                          : !selectedAssetId
                          ? "Select an asset first"
                          : "No sampling points available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Serial Number */}
            <Input
              label="Serial Number *"
              placeholder="e.g., SN-2024-001"
              {...register("serial_number")}
              error={errors.serial_number?.message}
            />

            {/* Date Sampled */}
            <Input
              type="datetime-local"
              label="Date Sampled *"
              {...register("date_sampled")}
              error={errors.date_sampled?.message}
            />

            {/* Lab Name */}
            <Input
              label="Lab Name *"
              placeholder="e.g., LabCorp Oil Analysis"
              {...register("lab_name")}
              error={errors.lab_name?.message}
            />

            {/* Service Meter Reading */}
            <Input
              label="Service Meter Reading *"
              placeholder="e.g., 15000"
              {...register("service_meter_reading")}
              error={errors.service_meter_reading?.message}
            />

            {/* Hours */}
            <Input
              label="Hours *"
              placeholder="e.g., 1200"
              {...register("hrs")}
              error={errors.hrs?.message}
            />

            {/* Oil in Service */}
            <Input
              label="Oil in Service (hours)*"
              placeholder="e.g., 5000"
              {...register("oil_in_service")}
              error={errors.oil_in_service?.message}
            />

            {/* Filter Changed */}
            <Controller
              control={control}
              name="filter_changed"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Filter Changed *">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {YES_NO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Oil Drained */}
            <Controller
              control={control}
              name="oil_drained"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Oil Drained *">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {YES_NO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Severity */}
            <Controller
              control={control}
              name="severity"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    label="Severity *"
                    error={errors.severity?.message}
                  >
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </section>

        {/* Wear Metals */}
        <section className="space-y-4 border-t pt-6">
          <Text variant="h6" className="text-gray-900 mb-4">
            Wear Metals (ppm)
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {METALS.map((metal) => (
              <Input
                key={metal.key}
                label={metal.label}
                suffix="ppm"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.wear_metals &&
                  typeof errors.wear_metals === "object" &&
                  metal.key in errors.wear_metals
                    ? (
                        errors.wear_metals as Record<
                          string,
                          { message?: string }
                        >
                      )[metal.key]?.message
                    : undefined
                }
                {...register(`wear_metals.${metal.key}`)}
              />
            ))}
          </div>
        </section>

        {/* Contaminants */}
        <section className="space-y-4 border-t pt-6">
          <Text variant="h6" className="text-gray-900 mb-4">
            Contaminants (ppm)
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTAMINANTS.map((contaminant) => (
              <Input
                key={contaminant.key}
                label={contaminant.label}
                suffix="ppm"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.contaminants &&
                  typeof errors.contaminants === "object" &&
                  contaminant.key in errors.contaminants
                    ? (
                        errors.contaminants as Record<
                          string,
                          { message?: string }
                        >
                      )[contaminant.key]?.message
                    : undefined
                }
                {...register(
                  `contaminants.${contaminant.key}` as keyof EditSamplePayload
                )}
              />
            ))}
          </div>
        </section>

        {/* Particle Counts */}
        <section className="space-y-4 border-t pt-6">
          <Text variant="h6" className="text-gray-900 mb-4">
            Particle Count Analysis
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARTICLE_COUNTS.map((particle) => (
              <Input
                key={particle.key}
                label={particle.label}
                suffix="count"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.particle_counts &&
                  typeof errors.particle_counts === "object" &&
                  particle.key in errors.particle_counts
                    ? (
                        errors.particle_counts as Record<
                          string,
                          { message?: string }
                        >
                      )[particle.key]?.message
                    : undefined
                }
                {...register(
                  `particle_counts.${particle.key}` as keyof EditSamplePayload
                )}
              />
            ))}
          </div>
        </section>

        {/* Viscosity Levels */}
        <section className="space-y-4 border-t pt-6">
          <Text variant="h6" className="text-gray-900 mb-4">
            Viscosity Levels (cSt)
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VISCOSITY_LEVELS.map((viscosity) => (
              <Input
                key={viscosity.key}
                label={viscosity.label}
                suffix="cSt"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.viscosity_levels &&
                  typeof errors.viscosity_levels === "object" &&
                  viscosity.key in errors.viscosity_levels
                    ? (
                        errors.viscosity_levels as Record<
                          string,
                          { message?: string }
                        >
                      )[viscosity.key]?.message
                    : undefined
                }
                {...register(
                  `viscosity_levels.${viscosity.key}` as keyof EditSamplePayload
                )}
              />
            ))}
          </div>
        </section>

        {/* Additives */}
        <section className="space-y-4 border-t pt-6">
          <Text variant="h6" className="text-gray-900 mb-4">
            Additives (ppm)
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ADDITIVES.map((additive) => (
              <Input
                key={additive.key}
                label={additive.label}
                suffix="ppm"
                type="text"
                placeholder="Additive"
                error={
                  errors?.additives &&
                  typeof errors.additives === "object" &&
                  additive.key in errors.additives
                    ? (
                        errors.additives as Record<string, { message?: string }>
                      )[additive.key]?.message
                    : undefined
                }
                {...register(`additives.${additive.key}`)}
              />
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Update Sample
          </Button>
        </div>
      </form>
    </div>
  );
}
