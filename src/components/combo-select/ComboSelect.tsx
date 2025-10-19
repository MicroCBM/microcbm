"use client";
import React from "react";
import ReactSelect, {
  SelectComponentsConfig,
  StylesConfig,
  components,
} from "react-select";
import { cn } from "@/libs";
import { Icon } from "@/libs/icon";
import { ErrorText } from "../error-text";
import { Label } from "../label";

type DropdownOption = {
  label: string;
  value: string;
  color?: string;
};

type Props = Readonly<
  {
    options: DropdownOption[];
    onChange?: (option: string) => void;
    value?: string;
    extraOnChange?: (option: string) => void;
    error?: string;
    label?: string;
    className?: string;
    isRequired?: boolean;
    inputRef?: React.Ref<HTMLSelectElement>;
    isDisabled?: boolean;
  } & React.ComponentProps<typeof ReactSelect>
>;

// Custom Option component to display color badge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomOption = ({ children, data, ...props }: any) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {data.color && (
          <div
            className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: data.color }}
            title={data.color}
          />
        )}
        <span>{children}</span>
      </div>
    </components.Option>
  );
};

// Custom SingleValue component for selected value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomSingleValue = ({ children, data, ...props }: any) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {data.color && (
          <div
            className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: data.color }}
            title={data.color}
          />
        )}
        <span>{children}</span>
      </div>
    </components.SingleValue>
  );
};

// Custom MultiValue component for multi-select
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomMultiValue = ({ data, ...props }: any) => {
  return (
    <components.MultiValue {...props}>
      <div className="flex items-center gap-1">
        {data.color && (
          <div
            className="w-3 h-3 rounded border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: data.color }}
          />
        )}
        <span>{data.label}</span>
      </div>
    </components.MultiValue>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default React.forwardRef<any, Props>(function ComboboxSelect(
  props: Props,
  ref
) {
  const {
    options,
    onChange,
    value,
    extraOnChange,
    error,
    label,
    isRequired,
    inputRef,
    ...rest
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (option: any, meta: { name?: string }) => {
    const payload = props.isMulti
      ? option
      : { target: { value: option?.value, name: meta.name } };

    onChange?.(payload);
    extraOnChange?.(option);
  };

  return (
    <div className={cn(props.className, "flex flex-col gap-2")}>
      <div className="flex flex-col gap-[6px]">
        {label && (
          <Label
            htmlFor={props?.id ?? props.name}
            className="text-sm font-normal"
          >
            {label} {isRequired && <span className="text-error"> *</span>}
          </Label>
        )}
        <ReactSelect
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={inputRef ?? (ref as any)}
          id={props?.id ?? props.name}
          isDisabled={props.isDisabled}
          options={options}
          onChange={handleChange}
          value={
            // prettier-ignore
            props.isMulti
                ? value
                : options?.find((option) => option.value === value) ?? null
          }
          isClearable
          isSearchable
          styles={selectStyles}
          components={{
            ...selectComponents,
            Option: CustomOption,
            SingleValue: CustomSingleValue,
            MultiValue: CustomMultiValue,
          }}
          {...rest}
        />
      </div>
      <ErrorText error={error} />
    </div>
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectComponents: Partial<SelectComponentsConfig<any, any, any>> = {
  LoadingIndicator: () => {
    return (
      <Icon icon="hugeicons:spinner-outline" className="text-xl animate-spin" />
    );
  },
  IndicatorSeparator: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectStyles: StylesConfig<any> = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: "#000000",
    boxShadow: state.isFocused ? "none" : "none",
    backgroundColor: state.isDisabled ? "#f5f6f9" : "#ffffff",
    opacity: state.isDisabled ? 0.5 : undefined,
    ":hover": {
      borderColor: "#000000",
      borderWidth: "1px",
    },
    borderWidth: "1px",
    minHeight: "49px",
    borderRadius: "0px",
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: "#95979D",
    fontSize: "0.875rem",
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "#F7F7F7",
    color: "#BE3029",
    border: "1px dashed #CCCCCC",
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: "#000",
  }),
  multiValueRemove: (baseStyles) => ({
    ...baseStyles,
    ":hover": {
      backgroundColor: "#7272722f",
      color: "white",
    },
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    color: "black",
    ":hover": {
      backgroundColor: state.isSelected ? "#7272722f" : "#7272722f",
    },
    backgroundColor: state.isSelected
      ? "#7272722f"
      : state.isFocused
      ? "#7272722f"
      : undefined,
    cursor: state.isDisabled ? "not-allowed" : "default",
  }),
};
