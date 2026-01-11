"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/libs";
import { PaginatedTable, Text } from "@/components";
import { Organization, Sites } from "@/types";
import { ViewUserModal } from "./ViewUserModal";
import { activateUserService, deleteUserService } from "@/app/actions/user";
import { toast } from "sonner";
import { EditNewUser } from "./EditNewUser";
import { getUserListColumns, userListCsvHeaders } from "./tableConfigs";
import { useUserManagementBase } from "../hooks";
import { OPTIONS } from "@/utils/constants/filter";
import { useContentGuard } from "@/hooks";

interface USER_TYPE extends Record<string, unknown> {
  country: string;
  created_at: number;
  created_at_datetime: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  organization: {
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    industry: string;
    logo_url: string;
    members: unknown;
    name: string;
    owner: unknown;
    sites: unknown;
    team_strength: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  password_hash: string;
  phone: string;
  role: string;
  role_id: string | null;
  role_obj: unknown;
  site: {
    address: string;
    attachments: null;
    city: string;
    country: string;
    created_at: number;
    created_at_datetime: string;
    description: string;
    id: string;
    installation_environment: string;
    manager_email: string;
    manager_location: string;
    manager_name: string;
    manager_phone_number: string;
    members: unknown;
    name: string;
    organization: unknown;
    regulations_and_standards: unknown;
    tag: string;
    updated_at: number;
    updated_at_datetime: string;
  };
  status: string;
  updated_at: number;
  updated_at_datetime: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number;
  created_at: number;
  created_at_datetime: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: number;
  created_at_datetime: string;
}
interface UserTableProps {
  data: USER_TYPE[];
  className?: string;
  rolesData: Role[];
  organizations: Organization[];
  sites: Sites[];
}

export function UserTable({
  data,
  className,
  rolesData,
  organizations,
  sites,
}: UserTableProps) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<USER_TYPE | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleViewUser = (user: USER_TYPE) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleApproveUser = async (id: string) => {
    const result = await activateUserService(id);
    if (result.success) {
      toast.success("User approved and activated successfully!");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to approve user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await deleteUserService(id);
    if (result.success) {
      toast.success("User deleted successfully!");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete user");
    }
  };

  const handleEditUser = (user: USER_TYPE) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const { userPermissions, user } = useContentGuard();
  const { query, setQuery } = useUserManagementBase();

  const userListColumns = getUserListColumns({
    rolesData,
    sites,
    onViewUser: handleViewUser,
    onEditUser: handleEditUser,
    onApproveUser: handleApproveUser,
    onDeleteUser: handleDeleteUser,
    userPermissions,
    loginUser: user ? { role: user.role } : undefined,
  });

  return (
    <div className={cn("relative space-y-[37px]", className)}>
      <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
        <Text variant="h6" weight="medium">
          User Management ({data?.length ?? 0})
        </Text>
      </div>
      <PaginatedTable<USER_TYPE>
        filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
        columns={userListColumns}
        data={data}
        query={query}
        setQuery={setQuery}
        total={data?.length ?? 0}
        loading={false}
        csvHeaders={userListCsvHeaders}
        filterBy={{
          simpleSelects: [
            { label: "status", options: OPTIONS.USER_STATUS },
            { label: "role", options: rolesData.map((role) => role.name) },
            { label: "site", options: sites.map((site) => site.name) },
          ],
        }}
        searchPlaceholder="Search users"
        noExport
      />

      <ViewUserModal
        user={selectedUser}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />

      <EditNewUser
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rolesData={rolesData}
        organizations={organizations}
        sites={sites}
      />
    </div>
  );
}
