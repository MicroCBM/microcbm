import { PermissionType } from "./roles";

export interface IAdmin {
  id: string;
  email: string;
  first_name: string;
  full_name: string;
  isDeleted: boolean;
  isSuperAdmin: boolean;
  last_name: string;
  phone_number: string;
  profileImage: string | null;
  roles: {
    id: string;
    name: string;
    permissions: PermissionType[];
  }[];
  status: "active" | "deactivated" | "pending";
  lastLogin: string;
}
