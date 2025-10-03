"use client";
import React from "react";

import classes from "./Input.module.scss";

import { cn } from "@/libs";
import { Icon } from "@/libs/icon";
import { ErrorText } from "../error-text";
import { Label } from "../label";

type Props = Readonly<{
  [other: string]: unknown;

  error?: string | boolean;
  className?: string;
  label?: string;
  rows?: number;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"] | "textarea";
  name?: string;
  id?: string;
  disabled?: boolean;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  innerClassName?: string;
  inputClassName?: string;
}> &
  React.HTMLAttributes<HTMLInputElement> &
  React.HTMLAttributes<HTMLTextAreaElement>;

const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, Props>(
  (props: Props, ref: React.Ref<HTMLInputElement & HTMLTextAreaElement>) => {
    const {
      label,
      rows,
      type = "text",
      iconType,
      error = "",
      className,
      inputClassName,
      innerClassName,
      prefix,
      suffix,
      id,
      disabled,
      ...otherProps
    } = props;

    delete otherProps.defaultValue;

    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const isTextarea = type === "textarea";
    const ispassword = type === "password";
    const isCardNumber = iconType === "card-number";
    const isSecurityCode = iconType === "security-code";

    const [show, setShow] = React.useState(false);

    const computedTestId = `input-${label}`;

    const computedType = React.useMemo(() => {
      switch (type) {
        case "password":
          return show ? "text" : "password";
        case "date":
          return "date";
        default:
          return type;
      }
    }, [type, show]);

    const computedInputClassName = cn(
      "w-full border-none min-w-[0px] !outline-0 !bg-[transparent] self-stretch outline-none disabled:text-black",
      "text-black placeholder:text-grey placeholder:text-sm disabled:cursor-not-allowed",
      disabled && "bg-[]",
      inputClassName,
      classes.input
    );

    function focusOnInput() {
      const input = wrapperRef.current?.querySelector("input");
      if (!input) return;
      input.focus();
    }

    function handleWrapperClick(e: React.MouseEvent<HTMLDivElement>) {
      e.stopPropagation();
      focusOnInput();
    }

    function handleLabelClick(e: React.MouseEvent<HTMLLabelElement>) {
      e.stopPropagation();
      focusOnInput();
    }

    function handleToggleShow() {
      setShow((prev) => !prev);
      focusOnInput();
    }

    return (
      /* WRAPPER */
      <div
        ref={wrapperRef}
        className={cn("innerWrapper flex flex-col gap-[6px]", className)}
        onClick={handleWrapperClick}
      >
        {/* LABEL */}
        {label ? (
          <Label
            htmlFor={props?.id ?? props.name}
            onClick={handleLabelClick}
            className="font-normal"
          >
            {label}
          </Label>
        ) : null}

        {/* INNER */}
        <div
          className={cn(
            innerClassName,
            "flex items-center p-2 pr-2 pl-4 bg-white border border-grey",
            "focus-within:ring-[1px] focus-within:ring-blue/50 disabled:cursor-not-allowed",
            { "ring-1 ring-red-500": !!error },
            { "h-[46px]": !isTextarea },
            {
              "border cursor-not-allowed bg-grey-500 border-grey-100": disabled,
            }
          )}
          style={{
            backgroundColor: disabled ? "#F5F5F5" : "white",
          }}
        >
          {prefix}

          {/* TEXT FIELD */}
          {!isTextarea ? (
            <input
              data-testid={computedTestId}
              type={computedType}
              disabled={disabled}
              ref={ref}
              className={computedInputClassName}
              id={id ?? otherProps.name}
              {...otherProps}
            />
          ) : null}

          {/* TEXTAREA */}
          {isTextarea ? (
            <textarea
              data-testid={computedTestId}
              className={cn(computedInputClassName, className)}
              ref={ref}
              disabled={disabled}
              id={id ?? otherProps.name}
              rows={rows}
              {...otherProps}
            ></textarea>
          ) : null}

          {suffix}
          {ispassword ? (
            <button
              type="button"
              className="cursor-pointer"
              onClick={handleToggleShow}
            >
              {!show ? (
                <Icon icon="proicons:eye" className="size-6 text-grey" />
              ) : null}
              {show ? (
                <Icon icon="proicons:eye-off" className="size-6 text-grey" />
              ) : null}
            </button>
          ) : null}

          {isCardNumber && (
            <Icon
              icon="hugeicons:square-lock-02"
              className="size-6 text-grey"
            />
          )}

          {isSecurityCode && (
            <Icon icon="hugeicons:help-circle" className="size-6 text-grey" />
          )}
        </div>

        {/* MESSAGE */}
        <ErrorText error={error} />
      </div>
    );
  }
);

export default Input;
Input.displayName = "Input";
