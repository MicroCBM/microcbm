import { cn } from "@/libs";
import { Text } from "../text";

type Props = Readonly<{
  error?: string | { message: string } | boolean;
  className?: string;
}>;

export function ErrorText({ error, className }: Props) {
  return error && typeof error !== "boolean" ? (
    <Text variant="span" className={cn("text-red-500", className)}>
      {typeof error === "string" ? error : error?.message}
    </Text>
  ) : null;
}
