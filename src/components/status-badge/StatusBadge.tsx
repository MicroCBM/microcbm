import { cn } from "@/libs";

export interface StatusBadgeProps {
  status: "Active" | "Inactive" | "Pending";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    Active: "border border-green-100 bg-green-200 text-green-100",
    Inactive: "border border-red bg-red-100 text-red",
    Pending: "border border-orange bg-orange-100 text-orange",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium",
        statusConfig[status],
        className
      )}
    >
      {status}
    </span>
  );
}
