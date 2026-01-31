import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/components";
import Input from "@/components/input/Input";

interface SampleInformationFormProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  documentFile?: File | null;
  setDocumentFile?: (file: File | null) => void;
}

export default function SampleInformationForm({
  handleNextStep,
  handlePreviousStep,
  documentFile = null,
  setDocumentFile,
}: SampleInformationFormProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 border border-gray-100 p-6">
        <Text variant="p">Sample Information</Text>
        <div className="flex flex-col gap-4">
          <Input
            label="Serial Number *"
            placeholder="e.g., SN-2024-001"
            {...register("serial_number")}
            error={errors.serial_number?.message}
          />
          <Input
            type="date"
            label="Date Sampled *"
            placeholder="e.g., 2024-01-01"
            {...register("date_sampled")}
            error={errors.date_sampled?.message}
          />
          <Input
            label="Lab Name *"
            placeholder="e.g., LabCorp Oil Analysis"
            {...register("lab_name")}
            error={errors.lab_name?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Service Meter Reading *"
              placeholder="e.g., 15000"
              {...register("service_meter_reading")}
              error={errors.service_meter_reading?.message}
            />
            <Controller
              control={control}
              name="hrs"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Hours *">
                    <SelectValue placeholder="Select a hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1200">1200</SelectItem>
                    <SelectItem value="1300">1300</SelectItem>
                    <SelectItem value="1400">1400</SelectItem>
                    <SelectItem value="1500">1500</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Input
            label="Oil in Service (hours)*"
            placeholder="e.g., 5000"
            {...register("oil_in_service")}
            error={errors.oil_in_service?.message}
          />
          <Controller
            control={control}
            name="filter_changed"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger label="Filter Changed *">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={control}
            name="oil_drained"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger label="Oil Drained *">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={control}
            name="severity"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger label="Severity *">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {setDocumentFile && (
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                label="Document (optional)"
                placeholder="Upload document"
                accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/bmp,image/tiff"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const isWebp =
                      file.type === "image/webp" ||
                      file.name.toLowerCase().endsWith(".webp");
                    if (isWebp) {
                      toast.error("WebP images are not allowed for documents.");
                      setDocumentFile(null);
                      e.target.value = "";
                      return;
                    }
                    setDocumentFile(file);
                  }
                }}
              />
              {documentFile && (
                <Text variant="span" className="text-sm text-gray-600">
                  Selected: {documentFile.name}
                </Text>
              )}
            </div>
          )}
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
