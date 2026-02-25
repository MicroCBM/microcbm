/** Failure modes (observable problem) - spec §4.1. Categories & values for dropdowns. */
export const FAILURE_MODE_CATEGORIES = [
  "Bearing",
  "Lubrication",
  "Mechanical",
  "Electrical",
  "Operational",
] as const;

export const FAILURE_MODES: { category: string; name: string }[] = [
  { category: "Bearing", name: "Bearing overheating" },
  { category: "Bearing", name: "Inner race defect" },
  { category: "Bearing", name: "Outer race defect" },
  { category: "Bearing", name: "Rolling element damage" },
  { category: "Bearing", name: "Cage failure" },
  { category: "Lubrication", name: "Oil contamination" },
  { category: "Lubrication", name: "Incorrect lubricant" },
  { category: "Lubrication", name: "Under-lubrication" },
  { category: "Lubrication", name: "Over-lubrication" },
  { category: "Mechanical", name: "Shaft misalignment" },
  { category: "Mechanical", name: "Soft foot" },
  { category: "Mechanical", name: "Coupling failure" },
  { category: "Mechanical", name: "Gear tooth wear" },
  { category: "Mechanical", name: "Seal failure" },
  { category: "Electrical", name: "Phase imbalance" },
  { category: "Electrical", name: "Insulation breakdown" },
  { category: "Electrical", name: "Rotor defect" },
  { category: "Operational", name: "Cavitation" },
  { category: "Operational", name: "Overload" },
  { category: "Operational", name: "Frequent starts/stops" },
];

/** Root cause categories - spec §4.2 */
export const ROOT_CAUSE_CATEGORIES = [
  "Maintenance",
  "Design",
  "Operational",
  "Human Factors",
  "Environmental",
  "Organizational/Systemic",
] as const;

export const ROOT_CAUSES: { id: string; category: string; description: string }[] = [
  { id: "rc-1", category: "Maintenance", description: "Improper lubrication practice" },
  { id: "rc-2", category: "Human Factors", description: "Procedure not followed" },
  { id: "rc-3", category: "Design", description: "Undersized bearing" },
  { id: "rc-4", category: "Environmental", description: "Water ingress" },
  { id: "rc-5", category: "Organizational/Systemic", description: "No PM schedule" },
  { id: "rc-6", category: "Operational", description: "Operating outside design limits" },
];

export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

export const RCA_STATUSES = [
  "Draft",
  "Investigation",
  "Review",
  "Actions Open",
  "Verification",
  "Closed",
] as const;

export const ACTION_TYPES = ["Corrective", "Preventive", "Systemic"] as const;
export const ACTION_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export const ACTION_STATUSES = [
  "Open",
  "In Progress",
  "Completed",
  "Verified",
  "Overdue",
] as const;

export const FISHBONE_CATEGORIES = [
  "Man",
  "Machine",
  "Method",
  "Material",
  "Measurement",
  "Environment",
] as const;
