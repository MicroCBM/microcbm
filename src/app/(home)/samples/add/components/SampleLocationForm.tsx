import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { Asset, SamplingPoint, Sites, Organization } from "@/types";

interface SampleLocationFormProps {
  sites: Sites[];
  assets: Asset[];
  handleNextStep: () => void;
  samplingPoints: SamplingPoint[];
  organizations: Organization[];
}

export default function SampleLocationForm({
  sites,
  handleNextStep,
  assets,
  samplingPoints,
  organizations,
}: SampleLocationFormProps) {
  const {
    control,
    watch,
    setValue,
    // formState: { errors },
  } = useFormContext();

  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  const selectedSiteId = watch("site.id");
  const selectedAssetId = watch("asset.id");
  const previousOrganizationRef = useRef<string | null>(null);
  const previousSiteRef = useRef<string | null>(null);
  const previousAssetRef = useRef<string | null>(null);

  // Filter sites based on selected organization
  const filteredSites = useMemo(() => {
    if (!selectedOrganizationId) return sites;
    return sites.filter(
      (site) => site.organization?.id === selectedOrganizationId
    );
  }, [selectedOrganizationId, sites]);

  // Filter assets based on selected site
  const filteredAssets = useMemo(() => {
    if (!selectedSiteId) return assets;
    return assets.filter((asset) => asset.parent_site?.id === selectedSiteId);
  }, [selectedSiteId, assets]);

  // Filter sampling points based on selected asset
  const filteredSamplingPoints = useMemo(() => {
    if (!selectedAssetId) return samplingPoints;
    return samplingPoints.filter(
      (sp) => sp.parent_asset?.id === selectedAssetId
    );
  }, [selectedAssetId, samplingPoints]);

  // Clear site when organization changes
  useEffect(() => {
    if (
      previousOrganizationRef.current !== selectedOrganizationId &&
      previousOrganizationRef.current !== null
    ) {
      setValue("site.id", "", { shouldDirty: false });
    }
    previousOrganizationRef.current = selectedOrganizationId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganizationId]);

  // Clear asset when site changes
  useEffect(() => {
    if (
      previousSiteRef.current !== selectedSiteId &&
      previousSiteRef.current !== null
    ) {
      setValue("asset.id", "", { shouldDirty: false });
    }
    previousSiteRef.current = selectedSiteId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSiteId]);

  // Clear sampling point when asset changes
  useEffect(() => {
    if (
      previousAssetRef.current !== selectedAssetId &&
      previousAssetRef.current !== null
    ) {
      setValue("sampling_point.id", "", { shouldDirty: false });
    }
    previousAssetRef.current = selectedAssetId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssetId]);
  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6">
        <section className="flex flex-col gap-6 border border-gray-100 p-6">
          <Text variant="p">Sample Location</Text>
          <div className="flex flex-col gap-4">
            {/* Organization Select */}
            <Select
              value={selectedOrganizationId || ""}
              onValueChange={setSelectedOrganizationId}
            >
              <SelectTrigger label="Organization">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((organization) => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Controller
              control={control}
              name="site.id"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={!selectedOrganizationId}
                >
                  <SelectTrigger label="Site">
                    <SelectValue
                      placeholder={
                        !selectedOrganizationId
                          ? "Select an organization first"
                          : filteredSites.length === 0
                          ? "No sites available"
                          : "Select a site"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSites.map((site) => (
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
                  disabled={!selectedSiteId}
                >
                  <SelectTrigger label="Asset">
                    <SelectValue
                      placeholder={
                        !selectedSiteId
                          ? "Select a site first"
                          : filteredAssets.length === 0
                          ? "No assets available"
                          : "Select an asset"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssets.map((asset) => (
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
                  disabled={!selectedAssetId}
                >
                  <SelectTrigger label="Sampling Point">
                    <SelectValue
                      placeholder={
                        !selectedAssetId
                          ? "Select an asset first"
                          : filteredSamplingPoints.length === 0
                          ? "No sampling points available"
                          : "Select a sampling point"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSamplingPoints.length > 0 &&
                      filteredSamplingPoints.map((sp) => (
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
