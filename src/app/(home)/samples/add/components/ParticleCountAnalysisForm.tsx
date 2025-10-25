import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

interface ParticleCountAnalysisFormProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export default function ParticleCountAnalysisForm({
  handleNextStep,
  handlePreviousStep,
}: ParticleCountAnalysisFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const particleCountAnalysis = [
    { key: "4_micron", label: "4 Micron", symbol: "4 µm" },
    { key: "8_micron", label: "8 Micron", symbol: "8 µm" },
    { key: "14_micron", label: "14 Micron", symbol: "14 µm" },
    { key: "20_micron", label: "20 Micron", symbol: "20 µm" },
    { key: "25_micron", label: "25 Micron", symbol: "25 µm" },
    { key: "50_micron", label: "50 Micron", symbol: "50 µm" },
    { key: "75_micron", label: "75 Micron", symbol: "75 µm" },
    { key: "100_micron", label: "100 Micron", symbol: "100 µm" },
  ];

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <Text variant="p" className="font-semibold">
            Particle Count Analysis
          </Text>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {particleCountAnalysis.map((particleCount) => (
            <div key={particleCount.key} className="flex flex-col gap-2">
              <Input
                label={particleCount.label}
                suffix="count"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.wear_metals &&
                  typeof errors.particleCountAnalysis === "object" &&
                  particleCount.key in errors.particleCountAnalysis
                    ? (
                        errors.particleCountAnalysis as Record<
                          string,
                          { message?: string }
                        >
                      )[particleCount.key]?.message
                    : undefined
                }
                {...register(`particle_counts.${particleCount.key}`)}
              />
            </div>
          ))}

          <Input
            label="Cleanliness Code (ISO 4406)"
            placeholder="ISO 4406"
            error={errors?.cleanliness_code?.message}
            {...register("cleanliness_code")}
          />

          <Input
            label="PVI"
            placeholder="PVI"
            error={errors?.pvi?.message}
            {...register("pvi")}
          />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleNextStep}>Next</Button>
      </div>
    </section>
  );
}
