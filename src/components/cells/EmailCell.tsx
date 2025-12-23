import { type TableCellProps } from "@/types";

export function EmailCell({ row }: TableCellProps) {
  const { email, user_email } = row.original;
  const emailValue = (email as string) || (user_email as string) || "-";
  return <span className="lowercase">{emailValue}</span>;
}
