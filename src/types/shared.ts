import { PermissionType } from "./roles";

export type MenuItem = {
  label: string;
  children: {
    icon: string;
    name: string;
    path: string;
    permission: PermissionType;
  }[];
};
