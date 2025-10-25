import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

interface WearMetalsFormProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export default function WearMetalsForm({
  handleNextStep,
  handlePreviousStep,
}: WearMetalsFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const metals = [
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

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <Text variant="p" className="font-semibold">
            Wear Metals (ppm)
          </Text>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {metals.map((metal) => (
            <div key={metal.key} className="flex flex-col gap-2">
              <Input
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
            </div>
          ))}
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
