import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Text } from "@/components";
import Input from "@/components/input/Input";

interface AdditivesFormProps {
  handlePreviousStep: () => void;
  handleComplete: () => void;
  isSubmitting?: boolean;
}

export default function AdditivesForm({
  handlePreviousStep,
  handleComplete,
  isSubmitting = false,
}: AdditivesFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const additives = [
    { key: "magnesium", label: "Magnesium (Mg)", symbol: "Mg" },
    { key: "calcium", label: "Calcium (Ca)", symbol: "Ca" },
    { key: "molybdenum", label: "Molybdenum (Mo)", symbol: "Mo" },
    { key: "zinc", label: "Zinc (Zn)", symbol: "Zn" },
    { key: "phosphorus", label: "Phosphorus (P)", symbol: "P" },
    { key: "sulfur", label: "Sulfur (S)", symbol: "S" },
    { key: "boron", label: "Boron (B)", symbol: "B" },
  ];

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <Text variant="p" className="font-semibold">
            Additives
          </Text>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {additives.map((additive) => (
            <div key={additive.key} className="flex flex-col gap-2">
              <Input
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
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleComplete} loading={isSubmitting}>
          Complete
        </Button>
      </div>
    </section>
  );
}
