import { cn } from "@/libs";
import React from "react";

type PossibleTextElements =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label";
type Props = {
  children: React.ReactNode;
  as?: PossibleTextElements;
  weight?:
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  asVariant?: boolean;
  className?: string;
} & React.ComponentProps<PossibleTextElements>;

export const Text = React.memo((props: Props) => {
  const {
    as = "div",
    variant = "p",
    weight,
    asVariant = false,
    className = "",
    children,
    ...rest
  } = props;

  const computedFontWeight = React.useMemo(() => {
    if (!weight)
      return variant.includes("h") // if it's a heading text
        ? "semibold"
        : "normal";
    return weight;
  }, [weight, variant]);

  const fontWeights: Record<Exclude<Props["weight"], undefined>, string> = {
    light: "!font-light",
    normal: "!font-normal",
    medium: "!font-medium",
    semibold: "!font-semibold",
    bold: "!font-bold",
    extrabold: "!font-extrabold",
    black: "!font-black",
  };

  const variantClasses: Record<Exclude<Props["variant"], undefined>, string> = {
    h1: "text-[64px] leading-[72px]",
    h2: "text-[56px] leading-[64px]",
    h3: "text-[48px] leading-[56px]",
    h4: "text-[40px] leading-[48px]",
    h5: "text-[32px] leading-[40px]",
    h6: "text-[24px] leading-[32px]",
    p: "text-base leading-[32px]",
    span: "text-sm leading-[24px]",
  };

  const classNames = cn([
    className,
    { [variantClasses[variant]]: !!variant },
    { [fontWeights[computedFontWeight]]: !!computedFontWeight },
  ]);

  const evaluatedElement = asVariant ? variant : as;

  return React.createElement(
    evaluatedElement,
    { className: classNames, ...rest },
    children
  );
});

Text.displayName = "Text";
