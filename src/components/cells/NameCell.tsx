import { type TableCellProps } from "@/types";
import { Avatar } from "../avatar";

export function NameCell({ row }: TableCellProps) {
  const { first_name, last_name, full_name } = row.original;
  const firstName = (first_name as string) || "";
  const lastName = (last_name as string) || "";
  const fullName = (full_name as string) || `${firstName} ${lastName}`.trim();
  const displayName = fullName || "-";

  return (
    <div className="flex items-center gap-2">
      <Avatar
        className="text-xs flex justify-center items-center"
        size="xs"
        name={displayName}
        fallback={displayName}
      />
      {displayName}
    </div>
  );
}
