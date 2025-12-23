import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components";
import type { TableCellProps } from "@/types";
import {
  DISABLE_PERMISSION_MODULES,
  PERMISSION_KEYS,
} from "@/utils/constants/rolesAndPermissions";

export function CheckboxCell({
  row,
  getValue,
}: TableCellProps<{ module: string }>) {
  const { register, getValues, setValue } = useFormContext();
  const value = `${row.original?.module} ${getValue()}`;

  const selected_permissions = getValues("permissions");

  // automatically check the Read permission when other permissions are selected
  function handleClick() {
    if (selected_permissions.includes(value)) {
      const filtered_permissions = selected_permissions.filter(
        (perm: string) => perm !== value
      );
      setValue("permissions", filtered_permissions, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      const view = `${row.original?.module} view`;
      const non_duplicate = new Set([...selected_permissions, view, value]);
      setValue("permissions", Array.from(non_duplicate), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  return (
    <div className="w-full flex justify-center">
      <Checkbox
        {...register("permissions")}
        value={DISABLE_PERMISSION_MODULES.includes(value) ? "" : value}
        onClick={handleClick}
        aria-label={value}
        disabled={DISABLE_PERMISSION_MODULES.includes(value)}
      />
    </div>
  );
}

export function AllCheckboxCell({ row }: TableCellProps<{ module: string }>) {
  const { getValues, setValue } = useFormContext();

  const selected_permissions: string[] = getValues("permissions");
  const current_permissions = PERMISSION_KEYS.map(
    (item: string) => `${row.original?.module} ${item}`
  );
  const all_in = current_permissions.every((value) =>
    selected_permissions.includes(value)
  );
  const count_some_in = current_permissions.filter((value) =>
    selected_permissions.includes(value)
  ).length;
  const some_in = count_some_in > 0 && count_some_in < 4;

  function handleClick() {
    if (!all_in) {
      setValue(
        "permissions",
        [...selected_permissions, ...current_permissions],
        { shouldValidate: true, shouldDirty: true }
      );
    }
    if (all_in) {
      const other_permissions = selected_permissions.filter(
        (value) => !current_permissions.includes(value)
      );
      setValue("permissions", other_permissions, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (some_in) {
      const non_duplicate = new Set([
        ...selected_permissions,
        ...current_permissions,
      ]);
      setValue("permissions", Array.from(non_duplicate), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  return (
    <div className="w-full flex justify-center ">
      <Checkbox
        onClick={handleClick}
        checked={all_in}
        aria-label={`${row.original?.module} all`}
      />
    </div>
  );
}
