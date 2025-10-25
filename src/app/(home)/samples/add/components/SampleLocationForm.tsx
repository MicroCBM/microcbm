import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Text,
} from "@/components";
import { Asset, SamplingPoint, Sites } from "@/types";

interface SampleLocationFormProps {
  sites: Sites[];
  assets: Asset[];
  handleNextStep: () => void;
  samplingPoints: SamplingPoint[];
}

export default function SampleLocationForm({
  sites,
  handleNextStep,
  assets,
  samplingPoints,
}: SampleLocationFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6">
        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Sample Location</Text>
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="site.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Site">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="asset.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Asset">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="sampling_point.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger label="Sampling Point">
                    <SelectValue placeholder="Select a sampling point" />
                  </SelectTrigger>
                  <SelectContent>
                    {samplingPoints?.length > 0 &&
                      samplingPoints.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id}>
                          {sp.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </section>
      </section>
      <div className="flex justify-end">
        <Button onClick={handleNextStep}>Next</Button>
      </div>
    </section>
  );
}
