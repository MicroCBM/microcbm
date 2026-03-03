"use client";

import { useId } from "react";
import type {
  GroupBase,
  SelectComponentsConfig,
  StylesConfig,
} from "react-select";
import CreatableReactSelect from "react-select/creatable";

import { cn, Icon } from "@/libs";
import type { DropdownOption } from "@/types";
import { Text } from "../text";
import { ErrorText } from "../error-text";

type SelectChangeEvent = {
  target: { value: string | undefined; name: string | undefined };
};

type Props = {
  options?: DropdownOption[];
  onChange?: (
    event: SelectChangeEvent | DropdownOption | readonly DropdownOption[]
  ) => void;
  value?: string | DropdownOption[];
  extraOnChange?: (option: DropdownOption | null) => void;
  error?: string | { message: string } | boolean;
  label?: string;
  className?: string;
  isDropdown?: boolean;
  iconBefore?: string;
} & Omit<
  React.ComponentProps<typeof CreatableReactSelect>,
  "onChange" | "value" | "options"
>;

export function CreatableCombobox(props: Props) {
  const {
    options,
    onChange,
    value,
    extraOnChange,
    error,
    label,
    isDropdown,
    iconBefore,
    ...rest
  } = props;

  // Generate stable ID for react-select to avoid hydration mismatches
  const instanceId = useId();
  const selectId = props?.id ?? props.name ?? instanceId;

  return (
    <div className={cn(props.className)}>
      {label && (
        <Text as="label" htmlFor={selectId}>
          {label}
        </Text>
      )}
      <div
        className={cn(
          "border focus-within:border-primary-400 hover:border-primary-400  flex justify-between flex-1 items-center overflow-hidden",
          {
            "hover:border-gray-300 border": isDropdown,
          }
        )}
      >
        {iconBefore && <Icon icon={iconBefore} className="ml-2" />}
        <CreatableReactSelect
          id={selectId}
          instanceId={selectId}
          options={options}
          menuPosition="fixed"
          onChange={(option, actionMeta) => {
            if (props.isMulti) {
              onChange?.(option as readonly DropdownOption[]);
            } else {
              const selected = option as DropdownOption | null;
              const val = selected?.value ?? selected?.label ?? "";
              onChange?.({
                target: { value: val, name: actionMeta.name },
              });
            }
            extraOnChange?.(option as DropdownOption | null);
          }}
          value={
            props.isMulti
              ? value
              : options?.find((option) => option.value === value) ??
                (value ? { value, label: value } : null)
          }
          isClearable
          isSearchable
          formatCreateLabel={(inputValue) => `Create: "${inputValue}"`}
          components={{ ...(props.components ?? {}), ...selectComponents } as React.ComponentProps<typeof CreatableReactSelect>["components"]}
          {...rest}
          styles={deepMergeStyles(
            selectStyles as unknown as Record<string, unknown>,
            props.styles as unknown as Record<string, unknown>
          ) as React.ComponentProps<typeof CreatableReactSelect>["styles"]}
        />
      </div>
      <ErrorText error={error} />
    </div>
  );
}

const selectComponents: Partial<
  SelectComponentsConfig<DropdownOption, boolean, GroupBase<DropdownOption>>
> = {
  LoadingIndicator: () => (
    <div className="flex justify-center items-center">
      <div>
        <Icon
          icon="hugeicons:spinner-outline"
          className="text-xl animate-spin"
        />
      </div>
    </div>
  ),
  IndicatorSeparator: () => null,
};

const selectStyles: StylesConfig<DropdownOption, boolean, GroupBase<DropdownOption>> = {
  container: (baseStyles) => ({
    ...baseStyles,
    flexGrow: 1,
  }),
  control: (baseStyles) => ({
    ...baseStyles,
    borderWidth: "1px",
    paddingBlock: "2px",
    paddingInline: "0",
    height: "48px",
    border: "none",
    minWidth: "0",
    flex: "1",
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-gray-300)",
    fontSize: "16px",
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--color-gray-100)",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--color-gray-100)",
    borderRadius: "4px",
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  multiValueRemove: (baseStyles) => ({
    ...baseStyles,
    ":hover": {
      backgroundColor: "var(--color-gray-100)",
      borderRadius: "4px",
      color: "var(--color-error-500)",
    },
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    background: "white",
    padding: "4px",
    borderRadius: "8px",
    boxShadow: "0",
    border: "1px solid var(--color-gray-200)",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    color: "black",
    borderRadius: "8px",
    padding: "8px",
    whiteSpace: "normal",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    hyphens: "none",
    ":hover": {
      backgroundColor: state.isSelected
        ? "var(--color-gray-100)"
        : "var(--color-gray-50)",
    },
    backgroundColor: state.isSelected
      ? "var(--color-gray-100)"
      : state.isFocused
      ? "white"
      : "white",
  }),
};

function deepMergeStyles(
  base: Record<string, unknown>,
  overrides: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!overrides) return base;
  return Object.keys(overrides).reduce(
    (merged, key) => {
      if (
        typeof base[key] === "function" &&
        typeof overrides[key] === "function"
      ) {
        const baseFn = base[key] as (...args: unknown[]) => Record<string, unknown>;
        const overrideFn = overrides[key] as (...args: unknown[]) => Record<string, unknown>;
        merged[key] = (...args: unknown[]) => ({
          ...baseFn(...args),
          ...overrideFn(...args),
        });
      } else if (
        typeof base[key] === "object" &&
        base[key] !== null &&
        !Array.isArray(base[key])
      ) {
        merged[key] = deepMergeStyles(
          base[key] as Record<string, unknown>,
          overrides[key] as Record<string, unknown>
        );
      } else {
        merged[key] = overrides[key];
      }
      return merged;
    },
    { ...base }
  );
}
