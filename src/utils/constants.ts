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

export const SITE_ASSIGNED = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Offshore Platform Alpha",
    value: "offshore-platform-alpha",
  },
  {
    label: "Bakken Compressor Station",
    value: "bakken-compressor-station",
  },
  {
    label: "Hawk Energy",
    value: "hawk-energy",
  },
  {
    label: "Kinder Morgan",
    value: "kinder-morgan",
  },
  {
    label: "Midland",
    value: "midland",
  },
  {
    label: "Pioneer",
    value: "pioneer",
  },
];
