export const ENV_VARS = {
  API_BASE_URL: `${process.env.NEXT_PUBLIC_API_URL}` || "http://localhost:3000",
};

export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const isTesting = ENVIRONMENT === "test";
export const isDev = ENVIRONMENT === "development";

export const STATUSES = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

export const ASSET_STATUSES = [
  {
    label: "All",
    value: "",
  },
  {
    label: "High",
    value: "high",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Critical",
    value: "critical",
  },
];

export const ROLES = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Super Admin",
    value: "super-admin",
  },
  {
    label: "Analyst",
    value: "analyst",
  },
  {
    label: "Viewer",
    value: "viewer",
  },
  {
    label: "Technician",
    value: "technician",
  },
];

export const ASSET_TYPE_OPTIONS = [
  {
    label: "Compressor",
    value: "compressor",
  },
  {
    label: "Pump",
    value: "pump",
  },
  {
    label: "Motor",
    value: "motor",
  },
  {
    label: "Gearbox",
    value: "gearbox",
  },
  {
    label: "Valve",
    value: "valve",
  },
];

export const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  search: "",
  name: "",
};

export const CIRCUIT_TYPE_OPTIONS = [
  "Circulating Oil (Recirculation System)",
  "Static Oil (Sump System)",
  "Hydraulic System",
  "Gear System",
  "Compressor System",
  "Turbine System",
  "Engine System",
  "Other",
];

export const COMPONENT_TYPE_OPTIONS = [
  "Gearbox",
  "Engine",
  "Hydraulic Pump",
  "Compressor",
  "Turbine",
  "Motor",
  "Bearing",
  "Transmission",
  "Other",
];

export const SAMPLE_FREQUENCY_OPTIONS = [
  "Daily (≈8-24 Hours)",
  "Weekly (≈40-168 Hours)",
  "Monthly (≈250-500 Hours)",
  "Quarterly (≈750-1500 Hours)",
  "Semi-annually (≈1500-3000 Hours)",
  "Annually (≈3000-6000 Hours)",
  "As needed",
];

export const SYSTEM_CAPACITY_OPTIONS = [
  "Small (< 5 L / < 1.3 Gal)",
  "Medium (5 L - 50 L / 1.3 - 13 Gal)",
  "Large (50 L - 500 L / 13 - 132 Gal)",
  "Very Large (> 500 L / > 132 Gal)",
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Under Maintenance" },
];

export const SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];
