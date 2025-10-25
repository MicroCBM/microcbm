import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

interface ViscosityFormProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export default function ViscosityForm({
  handleNextStep,
  handlePreviousStep,
}: ViscosityFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const viscosityLevels = [
    { key: "40_cst", label: "Viscosity @ 40°C", symbol: "40 cSt" },
    { key: "100_cst", label: "Viscosity @ 100°C", symbol: "100 cSt" },
  ];

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <Text variant="p" className="font-semibold">
            Viscosity Levels
          </Text>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {viscosityLevels.map((viscosityLevel) => (
            <div key={viscosityLevel.key} className="flex flex-col gap-2">
              <Input
                label={viscosityLevel.label}
                suffix="cSt"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.viscosityLevels &&
                  typeof errors.viscosityLevels === "object" &&
                  viscosityLevel.key in errors.viscosityLevels
                    ? (
                        errors.viscosityLevels as Record<
                          string,
                          { message?: string }
                        >
                      )[viscosityLevel.key]?.message
                    : undefined
                }
                {...register(`viscosity_levels.${viscosityLevel.key}`)}
              />
            </div>
          ))}

          <Input
            label="Viscosity Index"
            suffix="VI"
            type="number"
            step="0.01"
            placeholder="Number"
            error={errors?.viscosity_index?.message}
            {...register("viscosity_index")}
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
