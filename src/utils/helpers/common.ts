import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
export function getTarget(
  inputObj: Record<string, unknown>,
  path: string | string[]
): unknown {
  const pathArr = Array.isArray(path) ? path : path?.split(".");
  return pathArr.reduce<unknown>((target, currentPath) => {
    if (target && typeof target === "object" && currentPath in target) {
      return (target as Record<string, unknown>)[currentPath];
    }
    return undefined;
  }, inputObj);
}

export function getFullName(customer: {
  first_name: string;
  last_name: string;
}) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ");
}

export function getQueryString(obj?: Record<string, unknown>) {
  if (!obj || typeof obj !== "object") return "";

  return Object.entries(obj)
    .filter(([, value]) => value != null && value !== "") // Exclude null, undefined, and empty string
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
}

export function sentenceCase(str: string) {
  return str?.replace(/\.\s+([a-z])[^\\.]|^(\s*[a-z])[^\\.]/g, (s) =>
    s.replace(/([a-z])/, (s) => s.toUpperCase())
  );
}

export function makeDropdownOptions(items: string[]) {
  return items.map((item) => ({
    label: sentenceCase(item),
    value: item,
  }));
}

export function formatDate(
  value: string | number,
  format = "DD - MM - YYYY",
  userTimezone?: string
): string {
  if (!value && value !== 0) return "";

  // Parse the input as UTC (works for both strings and timestamps)
  const utcDate = dayjs.utc(value);

  if (!utcDate.isValid()) return "";

  // Convert to user timezone if provided, else use local timezone
  return userTimezone
    ? utcDate.tz(userTimezone).format(format)
    : utcDate.local().format(format);
}

export function camelToSpaced(str: string) {
  return str?.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

export const SPECIAL_CHARACTERS = "!@#$%^&*()";

export function getStatusVariant(status?: string) {
  switch (status) {
    case "active":
      return "success";
    case "successful":
      return "success";
    case "completed":
      return "success";
    case "paid":
      return "success";
    case "approved":
      return "success";
    case "processing":
      return "warning";
    case "pending":
      return "warning";
    case "failed":
      return "error";
    case "inactive":
      return "error";
    case "deactivate":
      return "error";
    case "deactivated":
      return "error";
    case "rejected":
      return "error";
    default:
      return "warning";
  }
}

export function getStatusText(status?: string) {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "deactivated":
      return "Deactivated";
    case "deactivate":
      return "Deactivated";
    default:
      return "Pending";
  }
}

import { IAdmin } from "@/types/entities";

export function getAdminRoles(roles?: IAdmin["roles"]) {
  if (!roles) return [];
  const outArr: Array<{ label: string; value: string }> = [];

  for (const item of roles) {
    outArr.push({ label: item.name, value: item.id });
  }

  return outArr;
}

export function formatFileSize(sizeInBytes: number): string {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;

  if (sizeInBytes < kilobyte) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < megabyte) {
    return `${(sizeInBytes / kilobyte).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / megabyte).toFixed(2)} MB`;
  }
}

/**
 * Masks a phone number by showing only the first 3 and last 2 digits
 * @param phoneNumber - The phone number to mask (can include non-digit characters)
 * @returns Masked phone number in format "XXX********YY"
 */
export function maskNumber(number: string | null): string {
  if (!number) return "";
  // Remove all non-digit characters
  const digits = number.replace(/\D/g, "");

  // Check if we have enough digits
  if (digits.length < 5) {
    throw new Error("number must have at least 5 digits");
  }

  // Extract first 3 and last 2 digits
  const first3 = digits.slice(0, 3);
  const last2 = digits.slice(-2);

  // Calculate number of asterisks needed
  const middleLength = digits.length - 5;
  const asterisks = "*".repeat(middleLength);

  return `${first3}${asterisks}${last2}`;
}

export function formatCurrency(
  value: number,
  currency: string = "NGN",
  fractionalDigit: number = 2,
  locale: string = "en-NG"
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: fractionalDigit,
  });

  const formattedValue = formatter.format(value);

  const decimalPart = formattedValue.includes(".")
    ? formattedValue.split(".")[1]
    : "";
  const isDecimalZeroes = decimalPart.includes("00");

  if (isDecimalZeroes) {
    return formattedValue.split(".")[0];
  }

  return formattedValue;
}

export const formatRoleNames = (arr: Array<{ name: string }>) =>
  arr.length <= 2
    ? arr.map((a) => a.name).join(", ")
    : `${arr[0].name}, ${arr[1].name} +${arr.length - 2} more`;

interface StaffCsvDataItem {
  staffName: string;
  emailAddress: string;
  phoneNumber: string | number;
  assignedRole: string;
}

export const transformStaffCsvData = (data: StaffCsvDataItem[]) =>
  data.map(({ staffName, emailAddress, phoneNumber, assignedRole }) => {
    const [first_name, last_name] = staffName.split(" ");
    return {
      first_name,
      last_name: last_name || "",
      email: emailAddress,
      phone_number: phoneNumber.toString(),
      role_names: [assignedRole],
    };
  });
