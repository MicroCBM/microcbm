"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/libs";

interface NavItem {
  label: string;
  icon?: string;
  href?: string;
  children?: NavItem[];
  isActive?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    {
      label: "Dashboards",
      icon: "solar:widget-4-bold-duotone",
      href: "/",
    },
    {
      label: "Assets",
      icon: "solar:database-bold-duotone",
      children: [
        { label: "Assets", href: "/assets" },
        { label: "Sites", href: "/sites" },
        { label: "Sampling Points", href: "/sampling-points" },
      ],
    },
    {
      label: "Samples",
      icon: "solar:bottle-bold-duotone",
      href: "/samples",
    },
    {
      label: "Alarms",
      icon: "solar:danger-triangle-bold-duotone",
      href: "/alarms",
    },
    {
      label: "Recommendations",
      icon: "solar:lightbulb-bold-duotone",
      href: "/recommendations",
    },
    {
      label: "Reports",
      icon: "solar:document-text-bold-duotone",
      href: "/reports",
    },
    {
      label: "Scheduling",
      icon: "solar:calendar-add-bold-duotone",
      href: "/scheduling",
    },
    {
      label: "User Management",
      icon: "solar:users-group-two-rounded-bold-duotone",
      href: "/user-management",
    },
  ];

  // Helper function to check if a route is active
  const isRouteActive = (href?: string, children?: NavItem[]): boolean => {
    if (!href) return false;

    // Check if current pathname matches the href exactly or starts with it
    if (pathname === href || (href !== "/" && pathname.startsWith(href))) {
      return true;
    }

    // Check if any child route is active
    if (children) {
      return children.some((child) => isRouteActive(child.href));
    }

    return false;
  };

  // Initialize expanded items based on current route
  const getInitialExpandedItems = () => {
    const expanded = new Set<string>();

    // Check if any child routes are active and expand their parents
    mainNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) =>
            pathname === child.href ||
            (child.href && pathname.startsWith(child.href))
        );
        if (hasActiveChild) {
          expanded.add(item.label);
        }
      }
    });

    return expanded;
  };

  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    getInitialExpandedItems
  );

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const isActive = isRouteActive(item.href, item.children);

    const content = (
      <div
        className={`
          flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors
          ${
            isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
          }
          ${level > 0 ? "ml-4 text-sm" : ""}
        `}
        onClick={() => hasChildren && toggleExpanded(item.label)}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <Icon
              icon={item.icon}
              className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
            />
          )}
          <span className="font-medium">{item.label}</span>
        </div>
        {hasChildren && (
          <Icon
            icon="solar:alt-arrow-down-bold-duotone"
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            } ${isActive ? "text-white" : "text-gray-400"}`}
          />
        )}
      </div>
    );

    return (
      <div key={item.label}>
        {hasChildren ? (
          content
        ) : item.href ? (
          <Link href={item.href}>{content}</Link>
        ) : (
          content
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => {
              const isChildActive =
                pathname === child.href ||
                (child.href && pathname.startsWith(child.href));
              return (
                <Link
                  key={child.label}
                  href={child.href || "#"}
                  className={`block px-3 py-2 text-sm rounded-lg ml-4 transition-colors ${
                    isChildActive
                      ? "text-black bg-gray-100 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 pt-20">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => renderNavItem(item))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">RD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Robbi Darwis
            </p>
            <p className="text-xs text-gray-500 truncate">
              flowforgestd@gmail.com
            </p>
          </div>
          <Icon
            icon="solar:external-link-bold-duotone"
            className="w-4 h-4 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
