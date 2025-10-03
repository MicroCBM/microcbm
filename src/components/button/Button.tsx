import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Icon, type IconifyIconProps } from "@iconify/react";

const buttonClasses = cva(
  "flex items-center justify-center gap-2 text-sm font-medium transition whitespace-nowrap outline-none ring-offset-2 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-brand-primary/80",
        outline: "border border-grey hover:bg-black hover:text-white",
        danger: "bg-red text-white hover:bg-red-400",
        secondary: "text-white bg-black",
        warning: "bg-yellow-100 text-white hover:bg-yellow-100/80",
        ghost: "bg-transparent text-black",
      },
      size: {
        small: "h-8 px-4 !text-xs !font-normal",
        medium: "h-10 px-4 !text-xs !font-normal",
        default: "h-12 px-6 rounded-none",
      },
      disabled: {
        true: "active:!scale-[1] cursor-not-allowed !text-white bg-grey-100",
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-sm",
        pill: "",
      },
      iconOnly: {
        true: "!p-3",
      },
      minW: {
        true: "min-w-[48px]",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        variant: "primary",
        className:
          "!bg-white-400 !text-black/50 border-grey border !cursor-not-allowed",
      },
      {
        disabled: true,
        variant: "outline",
        className: "opacity-30",
      },
      {
        iconOnly: true,
        size: "small",
        className: "!p-[10px]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      iconOnly: false,
      disabled: false,
      shape: "pill",
    },
  }
);

type ButtonClasses = VariantProps<typeof buttonClasses>;

type AsProp = React.ElementType | React.ComponentType<unknown>;

type ButtonProps<T extends AsProp = "button"> = {
  as?: T;
  icon?: IconifyIconProps["icon"];
  iconPosition?: "left" | "right";
  iconProps?: Partial<React.ComponentProps<typeof Icon>>;
  loading?: boolean;
  className?: string;
} & React.ComponentProps<"button" | typeof Link> &
  Omit<ButtonClasses, "minW">;

export function Button<T extends AsProp = "button">(props: ButtonProps<T>) {
  const {
    as = "button",
    iconProps = {},
    iconPosition,
    disabled,
    iconOnly,
    icon,
    loading = false,
    children,
    variant,
    className,
    size,
    ...rest
  } = props;

  const evaluatedProps = {
    className: buttonClasses({
      variant,
      size,
      disabled,
      iconOnly,
      className,
      minW: !className || !className.includes("h-"),
    }),
    disabled,
    ...rest,
  };

  const renderedIcon = icon ? <Icon {...iconProps} icon={icon} /> : null;

  return React.createElement(
    as,
    evaluatedProps as React.ComponentProps<typeof Link>,
    iconPosition === "left" && !loading && icon ? renderedIcon : null,
    iconOnly && icon && !loading ? renderedIcon : null,
    loading ? (
      <Icon icon="mdi:loading" className="animate-spin text-xl" />
    ) : null,
    !loading ? children : null,
    iconPosition === "right" && !loading && icon ? renderedIcon : null
  );
}
