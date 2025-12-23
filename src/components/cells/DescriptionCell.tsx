import { sentenceCase } from "@/utils/helpers/common";

export function DescriptionCell({
  getValue,
}: Readonly<{ getValue: () => string }>) {
  return <div className="normal-case">{sentenceCase(getValue()) || "-"}</div>;
}
