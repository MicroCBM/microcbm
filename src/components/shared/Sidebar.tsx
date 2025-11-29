"use client";
import React, { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/libs";
import { SessionUser } from "@/types";
import { useContentGuard } from "@/hooks";
import { logout } from "@/app/actions";
import { Text } from "@/components";
import { ComponentGuard } from "@/components/content-guard";
import { cn } from "@/libs";
import LogoColored from "../../../public/assets/svg/logo_colored.svg";
import menuItems from "@/utils/shared";

interface MenuItem {
  name: string;
  icon: string;
  path: string;
  permission?: string | string[];
}

interface MenuSection {
  label: string;
  children: MenuItem[];
}

// Custom hook to check section visibility based on children permissions
function useSidebarSection(section: MenuSection) {
  const { userPermissions, isLoading } = useContentGuard();

  // Count visible children (allowed and not loading)
  const visibleChildrenCount = React.useMemo(() => {
    const children = section.children || [];
    if (isLoading) return 0;

    return children.filter((child) => {
      const permission = child.permission;
      if (!permission) return true;

      const permissionsToCheck = Array.isArray(permission)
        ? permission
        : [permission];

      return permissionsToCheck.some((perm) => userPermissions.includes(perm));
    }).length;
  }, [section.children, isLoading, userPermissions]);

  const hasVisibleChildren = visibleChildrenCount > 0;

  return { hasVisibleChildren, isLoading };
}

type SectionProps = {
  section: MenuSection;
};

function SidebarSection({ section }: Readonly<SectionProps>) {
  const { hasVisibleChildren, isLoading } = useSidebarSection(section);

  // Don't render if no children
  if (!section.children || section.children.length === 0) {
    return null;
  }

  // Hide section while loading permissions
  if (isLoading) {
    return null;
  }

  // Don't render section if no children are visible
  if (!hasVisibleChildren) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="pl-[18px]">
        <Text
          variant="span"
          className="uppercase font-normal text-xs text-gray-500"
        >
          {section.label}
        </Text>
      </div>
      <div className="flex-1 space-y-4">
        {section.children.map((item) => (
          <SidebarLink
            key={item.path}
            name={item.name}
            icon={item.icon}
            path={item.path}
            permission={item.permission}
          />
        ))}
      </div>
    </div>
  );
}

type LinkProps = {
  name: string;
  icon: string;
  path: string;
  permission?: string | string[];
};

function SidebarLink({ name, icon, path, permission }: Readonly<LinkProps>) {
  const pathname = usePathname();
  const isActive =
    pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <ComponentGuard permissions={permission} unauthorizedFallback={null}>
      <div className="relative">
        <Link href={path}>
          <div
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-4 py-2 transition-colors",
              isActive
                ? "bg-primary-100 text-primary-800"
                : "text-gray-500 hover:text-primary-800 hover:bg-primary-300"
            )}
          >
            <Icon
              icon={icon}
              className={cn(
                "w-5 h-5",
                isActive
                  ? "text-primary-800"
                  : "text-gray-500 group-hover:text-gray-800"
              )}
            />
            <span className="text-sm">{name}</span>
          </div>
        </Link>
      </div>
    </ComponentGuard>
  );
}

export default function Sidebar({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [isLoggingOut, startLogout] = useTransition();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <LogoColored className="w-[136px] h-[28px]" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-8">
          {menuItems.map((section) => (
            <SidebarSection key={section.label} section={section} />
          ))}
        </div>
      </div>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          type="button"
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors w-full disabled:opacity-70"
          onClick={() => {
            if (isLoggingOut) return;
            startLogout(async () => {
              await logout();
              router.push("/auth/login");
            });
          }}
          disabled={isLoggingOut}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user ? user.email?.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user ? user.email : "Unknown User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user ? user.role : "Unknown Role"}
            </p>
          </div>
          <Icon
            icon={
              isLoggingOut
                ? "solar:loader-2-bold-duotone"
                : "solar:logout-3-bold-duotone"
            }
            className={cn(
              "w-4 h-4",
              isLoggingOut ? "text-blue-500 animate-spin" : "text-gray-400"
            )}
          />
        </button>
      </div>
    </div>
  );
}
