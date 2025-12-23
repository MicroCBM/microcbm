import { formatDate } from "@/utils/helpers/common";

export function DateCell({ getValue }: Readonly<{ getValue: () => string }>) {
  return (
    <div>
      {getValue()
        ? formatDate(getValue(), "MMM DD, YYYY", "Africa/Lagos")
        : "-"}
    </div>
  );
}
export function DateCellTimestamp({
  getValue,
}: Readonly<{ getValue: () => string }>) {
  return (
    <div>
      {getValue()
        ? formatDate(getValue(), "MMMM D, YYYY h:mm A", "Africa/Lagos")
        : "-"}
    </div>
  );
}
