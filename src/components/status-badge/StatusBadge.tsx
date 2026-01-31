import { cn } from "@/libs";

export type StatusBadgeStatus =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Low"
  | "Medium"
  | "High"
  | "Acknowledged"
  | "Unacknowledged";

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  className?: string;
}

const statusConfig: Record<StatusBadgeStatus, string> = {
  Active: "border border-green-100 bg-green-200 text-green-800",
  Inactive: "border border-red bg-red-100 text-red-800",
  Pending: "border border-orange bg-orange-100 text-orange-800",
  Low: "border border-green-100 bg-green-200 text-green-800",
  Medium: "border border-orange bg-orange-100 text-orange-800",
  High: "border border-red bg-red-100 text-red-800",
  Acknowledged: "border border-green-200 bg-green-100 text-green-800",
  Unacknowledged: "border border-red-200 bg-red-100 text-red-800",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.Pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
        config,
        className
      )}
    >
      {status}
    </span>
  );
}
