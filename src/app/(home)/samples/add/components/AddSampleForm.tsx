"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Text } from "@/components";
import { AddSamplePayload, ADD_SAMPLE_SCHEMA } from "@/schema";
import { addSampleService } from "@/app/actions";
import { Sites, Asset, SamplingPoint } from "@/types";
import dayjs from "dayjs";
import { Icon } from "@/libs";
import SampleLocationForm from "./SampleLocationForm";
import SampleInformationForm from "./SampleInformationForm";
import WearMetalsForm from "./WearMetalsForm";
import ContaminantsForm from "./ContaminantsForm";
import ParticleCountAnalysisForm from "./ParticleCountAnalysisForm";
import ViscosityForm from "./ViscosityForm";
import AdditivesForm from "./AdditivesForm";

interface AddSampleFormProps {
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}

export function AddSampleForm({
  sites,
  assets,
  samplingPoints,
}: AddSampleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddSamplePayload>({
    resolver: zodResolver(ADD_SAMPLE_SCHEMA),
    defaultValues: {
      severity: "normal",
      filter_changed: "No",
      oil_drained: "No",
      wear_metals: {
        iron: "",
        aluminum: "",
        silver: "",
        chromium: "",
        copper: "",
        lead: "",
        nickel: "",
        tin: "",
        titanium: "",
      },
    },
  });

  const onSubmit = async (data: AddSamplePayload) => {
    setIsSubmitting(true);
    try {
      // Convert date to Unix timestamp
      const dateSampled = dayjs(
        (data.date_sampled as unknown as string) || new Date()
      ).unix();

      // Transform wear metals object into array format
      const wearMetalsArray: Array<{
        element: string;
        value: number;
        unit: string;
      }> = [];

      const metals = [
        "iron",
        "aluminum",
        "silver",
        "chromium",
        "copper",
        "lead",
        "nickel",
        "tin",
        "titanium",
      ];

      if (data.wear_metals) {
        metals.forEach((metal) => {
          const value = data.wear_metals?.[metal];
          if (value !== undefined && value !== null && value !== "") {
            const numValue = parseFloat(value as string);
            if (!isNaN(numValue)) {
              wearMetalsArray.push({
                element: metal,
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

      const contaminantsMap: Record<string, string> = {
        silicon: "silicon",
        sodium: "sodium",
        potassium: "potassium",
        water: "water",
        total_acid_number: "total_acid_number",
      };

      // Handle contaminants as either object (from form) or array (already transformed)
      const contaminantsData = data.contaminants as
        | Record<string, string>
        | Array<{ type: string; value: number; unit: string }>
        | undefined;

      if (contaminantsData) {
        if (Array.isArray(contaminantsData)) {
          contaminantsArray.push(...contaminantsData);
        } else if (typeof contaminantsData === "object") {
          Object.entries(contaminantsData).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              contaminantsMap[key]
            ) {
              const numValue = parseFloat(value as string);
              if (!isNaN(numValue)) {
                contaminantsArray.push({
                  type: contaminantsMap[key],
                  value: numValue,
                  unit: "ppm",
                });
              }
            }
          });
        }
      }

      // Transform particle counts object into array format
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

      // Handle particle_counts as either object (from form) or array (already transformed)
      const particleCountsData = data.particle_counts as
        | Record<string, string>
        | Array<{ size_range: string; count: number; unit: string }>
        | undefined;

      if (particleCountsData) {
        if (Array.isArray(particleCountsData)) {
          particleCountsArray.push(...particleCountsData);
        } else if (typeof particleCountsData === "object") {
          Object.entries(particleCountsData).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              particleSizeMap[key]
            ) {
              const numValue = parseFloat(value as string);
              if (!isNaN(numValue)) {
                particleCountsArray.push({
                  size_range: particleSizeMap[key],
                  count: numValue,
                  unit: "particles/ml",
                });
              }
            }
          });
        }
      }

      // Transform viscosity levels object into array format
      const viscosityLevelsArray: Array<{
        temperature: number;
        viscosity: number;
        unit: string;
      }> = [];

      const viscosityTempMap: Record<string, number> = {
        "40_cst": 40,
        "100_cst": 100,
      };

      // Handle viscosity_levels as either object (from form) or array (already transformed)
      const viscosityLevelsData = data.viscosity_levels as
        | Record<string, string>
        | Array<{ temperature: number; viscosity: number; unit: string }>
        | undefined;

      if (viscosityLevelsData) {
        if (Array.isArray(viscosityLevelsData)) {
          viscosityLevelsArray.push(...viscosityLevelsData);
        } else if (typeof viscosityLevelsData === "object") {
          Object.entries(viscosityLevelsData).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              viscosityTempMap[key]
            ) {
              const numValue = parseFloat(value as string);
              if (!isNaN(numValue)) {
                viscosityLevelsArray.push({
                  temperature: viscosityTempMap[key],
                  viscosity: numValue,
                  unit: "cSt",
                });
              }
            }
          });
        }
      }

      // Convert filter_changed and oil_drained from "yes"/"no" to boolean
      const filterChanged =
        typeof data.filter_changed === "string"
          ? data.filter_changed.toLowerCase() === "yes"
          : false;
      const oilDrained =
        typeof data.oil_drained === "string"
          ? data.oil_drained.toLowerCase() === "yes"
          : false;

      // Build the payload
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
        // Add collection_date from date_sampled in ISO format
        collection_date: dayjs(
          (data.date_sampled as unknown as string) || new Date()
        ).toISOString(),
      };

      // Cast to unknown first to bypass type checking since we're transforming the data structure
      const response = await addSampleService(
        payload as unknown as AddSamplePayload
      );
      if (response.success) {
        toast.success("Sample created successfully", {
          description: "The sample has been added to your system.",
        });
        router.push("/samples");
      } else {
        toast.error(
          response.message || "Failed to create sample. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to create sample. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/samples");
  };

  const [steps, setSteps] = useState<number>(1);

  const handleNextStep = () => {
    setSteps(steps + 1);
  };

  const handlePreviousStep = () => {
    setSteps(steps - 1);
  };

  const handleComplete = () => {
    onSubmit(form.getValues());
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

          <Text variant="h6">Manual Entry</Text>
        </div>
        <div className="flex items-center gap-2">
          <Button size="medium" variant="outline">
            Discard
          </Button>
          <Button size="medium" variant="outline">
            Save Draft
          </Button>
          <Button size="medium">Create Sample</Button>
        </div>
      </section>

      <div>something here</div>

      <FormProvider {...form}>
        {steps === 1 && (
          <SampleLocationForm
            handleNextStep={handleNextStep}
            sites={sites}
            assets={assets}
            samplingPoints={samplingPoints}
          />
        )}
        {steps === 2 && (
          <SampleInformationForm
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        )}
        {steps === 3 && (
          <WearMetalsForm
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        )}
        {steps === 4 && (
          <ContaminantsForm
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        )}
        {steps === 5 && (
          <ParticleCountAnalysisForm
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        )}
        {steps === 6 && (
          <ViscosityForm
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        )}
        {steps === 7 && (
          <AdditivesForm
            handlePreviousStep={handlePreviousStep}
            handleComplete={handleComplete}
          />
        )}
      </FormProvider>
    </>
  );
}
