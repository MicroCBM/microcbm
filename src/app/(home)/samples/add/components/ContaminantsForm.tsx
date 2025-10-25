import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

interface ContaminantsFormProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export default function ContaminantsForm({
  handleNextStep,
  handlePreviousStep,
}: ContaminantsFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const contaminants = [
    { key: "silicon", label: "Silicon (Si)", symbol: "Si" },
    { key: "sodium", label: "Sodium (Na)", symbol: "Na" },
    { key: "potassium", label: "Potassium (K)", symbol: "K" },
    { key: "water", label: "Water", symbol: "H₂O" },
    { key: "total_acid_number", label: "Total Acid Number", symbol: "TAN" },
  ];

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <Text variant="p" className="font-semibold">
            Contaminants
          </Text>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {contaminants.map((contaminant) => (
            <div key={contaminant.key} className="flex flex-col gap-2">
              <Input
                label={contaminant.label}
                suffix="ppm"
                type="number"
                step="0.01"
                placeholder="Number"
                error={
                  errors?.wear_metals &&
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
                {...register(`contaminants.${contaminant.key}`)}
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
