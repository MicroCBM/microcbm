import { sentenceCase } from "@/utils/helpers/common";

const DEFAULT_MAX_LENGTH = 80;

export function DescriptionCell({
  getValue,
  maxLength = DEFAULT_MAX_LENGTH,
}: Readonly<{ getValue: () => string; maxLength?: number }>) {
  const full = sentenceCase(getValue()) || "-";
  const truncated =
    full.length > maxLength ? `${full.slice(0, maxLength).trim()}…` : full;
  return (
    <div
      className="normal-case text-sm text-gray-700 line-clamp-2"
      title={full.length > maxLength ? full : undefined}
    >
      {truncated}
    </div>
  );
}
