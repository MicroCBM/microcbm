import { type TableCellProps } from "@/types";
import { formatCurrency } from "@/utils/helpers/common";

export function CurrencyCell({ row }: TableCellProps) {
  const { amount } = row.original;
  return <span>{formatCurrency(amount as number)}</span>;
}
