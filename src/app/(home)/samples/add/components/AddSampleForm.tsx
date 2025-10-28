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
      const dateSampled = dayjs(data.date_sampled as unknown as string).unix();

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

      metals.forEach((metal) => {
        const value = (data as Record<string, unknown>)[`wear_metals.${metal}`];
        if (value !== undefined && value !== null && value !== "") {
          wearMetalsArray.push({
            element: metal,
            value: parseFloat(value as string),
            unit: "ppm",
          });
        }
      });

      const payload: unknown = {
        ...data,
        date_sampled: dateSampled,
        wear_metals: wearMetalsArray.length > 0 ? wearMetalsArray : undefined,
      };

      const response = await addSampleService(payload as AddSamplePayload);
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
