"use client";

import { useState } from "react";
import { Checkbox, Expandable, Text } from "@/components";
import { cn } from "@/libs/utils";
import { Icon } from "@iconify/react";
import { UseFormReturn, useWatch } from "react-hook-form";
import ArrowDownRightIcon from "../../../../../../public/assets/icons/arrow-down-right.svg";

export function PermissionGroup({
  groupName,
  permissions,
  form,
}: {
  groupName: string;
  permissions: Record<string, string>;
  form: UseFormReturn<{ permission_ids: string[] }>;
}) {
  const [open, toggleOpen] = useToggle(false);
  const { setValue, control } = form;
  const checkedPermissions: string[] =
    useWatch({ control, name: "permission_ids" }) || [];

  const permissionValues = Object.values(permissions);
  const selectedCount = permissionValues.filter((permission) =>
    checkedPermissions.includes(permission)
  ).length;
  const allChecked =
    permissionValues.length > 0 && selectedCount === permissionValues.length;
  const someChecked = selectedCount > 0 && !allChecked;

  const handleToggleAll = () => {
    if (allChecked) {
      setValue(
        "permission_ids",
        checkedPermissions.filter((p: string) => !permissionValues.includes(p))
      );
    } else {
      setValue("permission_ids", [...checkedPermissions, ...permissionValues]);
    }
    form.trigger("permission_ids");
  };

  const handleTogglePermission = (permission: string) => {
    if (checkedPermissions.includes(permission)) {
      setValue(
        "permission_ids",
        checkedPermissions.filter((p: string) => p !== permission)
      );
    } else {
      setValue("permission_ids", [...checkedPermissions, permission]);
    }
    form.trigger("permission_ids");
  };

  return (
    <li>
      <button
        type="button"
        className="flex gap-2 justify-between items-center w-full rounded-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
        onClick={() => {
          toggleOpen(!open);
        }}
      >
        <div className="flex gap-4">
          <span onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={
                allChecked
                  ? true
                  : someChecked && !allChecked
                  ? "indeterminate"
                  : false
              }
              onCheckedChange={handleToggleAll}
            />
          </span>
          <Text
            variant="span"
            weight="medium"
            className="capitalize text-neutral-grey-800"
          >
            {groupName}
          </Text>
        </div>

        <div className="flex gap-2 items-center">
          {selectedCount > 0 ? (
            <span className="bg-[#f1fef9] text-[#065535] h-6 px-2 flex items-center justify-center rounded-xl text-xs">
              {allChecked ? "All Selected" : `${selectedCount} Selected`}
            </span>
          ) : null}

          <span className="grid place-content-center w-8 h-8 rounded-xl bg-neutral-grey-50">
            <Icon
              icon="hugeicons:arrow-down-01"
              className={cn("size-4 transition-all", open && "rotate-180")}
            />
          </span>
        </div>
      </button>

      <Expandable open={open}>
        <div className="flex gap-2 pb-1 mt-2">
          <span className="relative -top-2 text-neutral-grey-200">
            <ArrowDownRightIcon className="size-7" />
          </span>
          <div className="flex flex-col gap-2">
            {Object.entries(permissions).map(([key, value]) => (
              <label
                key={key}
                className="flex gap-2 items-center text-sm capitalize cursor-pointer"
              >
                <Checkbox
                  tabIndex={open ? 0 : -1}
                  checked={checkedPermissions.includes(value)}
                  onCheckedChange={() => handleTogglePermission(value)}
                />
                {key.toLowerCase()}
              </label>
            ))}
          </div>
        </div>
      </Expandable>
    </li>
  );
}

function useToggle(
  initialValue?: boolean
): [boolean, (newValue?: boolean) => void] {
  const [value, setValue] = useState(initialValue ?? false);
  const toggle = (newValue?: boolean) => setValue(newValue ?? !value);
  return [value, toggle];
}
