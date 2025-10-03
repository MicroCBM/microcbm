import { cn, Icon } from "@/libs";
import { Text } from "../text";

interface ResendCodeProps {
  countdown: number | null;
  formatCountdown: (countdown: number) => string;
  onResend: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ResendCode({
  countdown,
  formatCountdown,
  onResend,
  isLoading = false,
  className,
}: Readonly<ResendCodeProps>) {
  return (
    <Text variant="span" className={cn("text-gray", className)}>
      Didn&apos;t get a code?{" "}
      {!countdown ? (
        <button
          type="button"
          onClick={onResend}
          disabled={isLoading}
          className="text-blue"
        >
          Resend code
        </button>
      ) : (
        <span>Resend in {formatCountdown(countdown)}</span>
      )}
      {isLoading && (
        <Icon icon="hugeicons:circle" className="animate-spin inline-block" />
      )}
    </Text>
  );
}
