"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DateRangeFilter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import {
  getSamplingPointSampleHistoryService,
  type SampleHistoryMeta,
} from "@/app/actions";
import { useContentGuard } from "@/hooks";
import type { Sample } from "@/types";
import type { Asset, SamplingPoint, Sites } from "@/types";
import type { Organization } from "@/types";
import dayjs from "dayjs";
import { Icon } from "@/libs";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const LIMIT = 50;
const UNIT = "ppm";

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface SampleHistoryContentProps {
  organizations: Organization[];
  sites: Sites[];
  assets: Asset[];
  samplingPoints: SamplingPoint[];
}

export function SampleHistoryContent({
  organizations,
  sites,
  assets,
  samplingPoints,
}: SampleHistoryContentProps) {
  const { user } = useContentGuard();
  const isSuperAdmin = user?.role === "SuperAdmin";

  const [orgId, setOrgId] = useState<string>("");
  const [siteId, setSiteId] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");
  const [samplingPointId, setSamplingPointId] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<Sample[]>([]);
  const [historyMeta, setHistoryMeta] = useState<SampleHistoryMeta | null>(null);

  // Non–super-admins: preselect and lock organization to their org
  useEffect(() => {
    if (!isSuperAdmin && user?.org_id) {
      setOrgId(user.org_id);
    }
  }, [isSuperAdmin, user?.org_id]);

  const filteredSites = useMemo(() => {
    if (!orgId) return sites;
    return sites.filter((s) => s.organization?.id === orgId);
  }, [orgId, sites]);

  const filteredAssets = useMemo(() => {
    if (!siteId) return assets;
    return assets.filter((a) => a.parent_site?.id === siteId);
  }, [siteId, assets]);

  const filteredSamplingPoints = useMemo(() => {
    if (!assetId) return samplingPoints;
    return samplingPoints.filter((sp) => sp.parent_asset?.id === assetId);
  }, [assetId, samplingPoints]);

  const fetchHistory = React.useCallback(
    async () => {
      if (!samplingPointId) return;
      setLoading(true);
      try {
        const result = await getSamplingPointSampleHistoryService(
          samplingPointId,
          {
            page: 1,
            limit: LIMIT,
            ...(orgId && { org_id: orgId }),
            ...(siteId && { site_id: siteId }),
            ...(assetId && { asset_id: assetId }),
            ...(dateRange[0] && {
              start_date: dayjs(dateRange[0]).startOf("day").toISOString(),
            }),
            ...(dateRange[1] && {
              end_date: dayjs(dateRange[1]).endOf("day").toISOString(),
            }),
          }
        );
        setHistoryData(result.data ?? []);
        setHistoryMeta(result.meta ?? null);
      } catch {
        setHistoryData([]);
        setHistoryMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [samplingPointId, orgId, siteId, assetId, dateRange]
  );

  const handleLoadHistory = () => {
    if (!samplingPointId) return;
    fetchHistory();
  };

  // Build chart data: one point per sample, X = date, Y = wear_metals (and optionally contaminants)
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!historyData || historyData.length === 0) return [];
    return historyData
      .slice()
      .sort((a, b) => a.date_sampled - b.date_sampled)
      .map((sample) => {
        const point: ChartDataPoint = {
          date: dayjs.unix(sample.date_sampled).format("MMM DD, YYYY"),
        };
        (sample.wear_metals || []).forEach((m) => {
          point[m.element] = m.value;
        });
        (sample.contaminants || []).forEach((c) => {
          point[c.type] = c.value;
        });
        return point;
      });
  }, [historyData]);

  const seriesNames = useMemo(() => {
    if (!chartData.length) return [];
    const names = new Set<string>();
    chartData.forEach((point) => {
      Object.keys(point).forEach((key) => {
        if (key !== "date" && typeof point[key] === "number") {
          names.add(key);
        }
      });
    });
    return Array.from(names);
  }, [chartData]);

  // High-contrast, visually distinct palette (no similar blues/greens)
  const colors = [
    "#0c4b77", // navy
    "#b91c1c", // red
    "#15803d", // green
    "#7e22ce", // purple
    "#c2410c", // orange
    "#0f766e", // teal
    "#be185d", // pink
    "#ca8a04", // amber
    "#1d4ed8", // blue
    "#dc2626", // red-6
    "#059669", // emerald
    "#6366f1", // indigo
  ];

  const allValues = chartData.flatMap((d) =>
    seriesNames.map((name) => (typeof d[name] === "number" ? (d[name] as number) : 0))
  );
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1;
  const yAxisMax = maxValue > 0 ? Math.ceil(maxValue * 1.15) : 10;
  const total = historyMeta?.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Sample History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View concentration trends for a sampling point over time
        </p>
      </header>

      {/* Two-column: filters left, chart right */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* Left: Filters */}
        <aside className="w-full shrink-0 lg:w-[320px]">
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <h2 className="text-sm font-medium text-gray-700">Filters</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Select sampling point and date range
              </p>
            </div>
            <div className="flex flex-col gap-4 p-4">
              {isSuperAdmin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">
                    Organization
                  </label>
                  <Select
                    value={orgId}
                    onValueChange={setOrgId}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All organizations" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Site</label>
                <Select value={siteId} onValueChange={setSiteId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All sites" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name || site.tag || site.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Asset
                </label>
                <Select value={assetId} onValueChange={setAssetId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All assets" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name || asset.tag || asset.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Sampling point <span className="text-red-500">*</span>
                </label>
                <Select value={samplingPointId} onValueChange={setSamplingPointId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select sampling point" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSamplingPoints.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id}>
                        {sp.name || sp.tag || sp.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Date range
                </label>
                <DateRangeFilter
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={setDateRange}
                  placeholder="Select date range"
                  format="DD-MM-YYYY"
                />
              </div>
              <Button
                onClick={handleLoadHistory}
                disabled={!samplingPointId || loading}
                className="h-9 w-full rounded-lg bg-[#0c4b77] hover:bg-[#0a3d62]"
              >
                {loading ? (
                  <Icon icon="mdi:loading" className="size-4 animate-spin" />
                ) : (
                  <>
                    <Icon icon="mdi:chart-line" className="size-4" />
                    Load chart
                  </>
                )}
              </Button>
            </div>
          </section>
        </aside>

        {/* Right: Chart or states */}
        <main className="min-h-[480px] min-w-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading && historyData.length === 0 && (
            <div className="flex min-h-[480px] flex-col items-center justify-center py-24">
              <Icon
                icon="mdi:loading"
                className="size-10 animate-spin text-[#0c4b77]"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading sample history…
              </p>
            </div>
          )}

          {!loading && historyData.length === 0 && historyMeta !== null && (
            <div className="flex min-h-[480px] flex-col items-center justify-center bg-gray-50/50 py-24 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-gray-200/80">
                <Icon
                  icon="mdi:chart-box-outline"
                  className="size-7 text-gray-500"
                />
              </div>
              <p className="mt-4 text-base font-medium text-gray-600">
                No sample history found
              </p>
              <p className="mt-1.5 text-sm text-gray-500">
                Try a different sampling point or date range
              </p>
            </div>
          )}

          {!loading && historyData.length === 0 && historyMeta === null && (
            <div className="flex min-h-[480px] flex-col items-center justify-center py-24 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-gray-100">
                <Icon
                  icon="mdi:chart-line-variant"
                  className="size-8 text-gray-600"
                />
              </div>
              <p className="mt-4 text-base font-semibold text-gray-800">
                Select a sampling point and load the chart
              </p>
              <p className="mt-1.5 max-w-sm text-sm text-gray-500">
                Choose a sampling point from the filters, then click Load chart
              </p>
            </div>
          )}

          {chartData.length > 0 && (
            <section className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-800">
                    Concentration over time
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {total} sample{total !== 1 ? "s" : ""} · values in ppm
                  </p>
                </div>
              </div>
              <div className="p-5 pt-2">
                <div className="h-[420px] w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={chartData}
                      margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        horizontal
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, yAxisMax]}
                        tickMargin={8}
                        label={{
                          value: `Concentration (${UNIT})`,
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            textAnchor: "middle",
                            fontSize: 11,
                            fill: "#6b7280",
                          },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          fontSize: 12,
                          padding: "12px 16px",
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: 8 }}
                        formatter={(value, name) => [
                          typeof value === "number" && !Number.isNaN(value)
                            ? `${value.toFixed(2)} ${UNIT}`
                            : `${value ?? "—"} ${UNIT}`,
                          String(name ?? "").replace(/_/g, " "),
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: 16 }}
                        iconType="line"
                        iconSize={8}
                        formatter={(value) => (
                          <span className="text-xs text-gray-600 capitalize">
                            {value.replace(/_/g, " ")}
                          </span>
                        )}
                        layout="horizontal"
                        verticalAlign="bottom"
                      />
                      {seriesNames.map((name, index) => (
                        <Line
                          key={name}
                          type="monotone"
                          dataKey={name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 2.5, fill: "white", strokeWidth: 2 }}
                          activeDot={{ r: 4, strokeWidth: 2 }}
                        />
                      ))}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                {seriesNames.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
                    {seriesNames.map((name, index) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <span
                          className="inline-block h-1 w-4 rounded-full shrink-0"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <span className="capitalize">
                          {name.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
