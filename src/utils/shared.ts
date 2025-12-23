import { MenuItem } from "@/types";

const menuItems: MenuItem[] = [
  {
    label: "Main",
    children: [
      {
        name: "Dashboards",
        icon: "solar:widget-4-bold-duotone",
        path: "/",
        permission: "dashboard:read",
      },
    ],
  },
  {
    label: "Oil Analysis",
    children: [
      {
        name: "Samples",
        icon: "solar:bottle-bold-duotone",
        path: "/samples",
        permission: "samples:read",
      },
      {
        name: "Alarms",
        icon: "solar:danger-triangle-bold-duotone",
        path: "/alarms",
        permission: "alarms:read",
      },
      {
        name: "Recommendations",
        icon: "solar:lightbulb-bold-duotone",
        path: "/recommendations",
        permission: "recommendations:read",
      },
    ],
  },
  {
    label: "Equipment",
    children: [
      {
        name: "Assets",
        icon: "solar:database-bold-duotone",
        path: "/assets",
        permission: "assets:read",
      },
      {
        name: "Sampling Points",
        icon: "solar:database-bold-duotone",
        path: "/sampling-points",
        permission: "sampling_points:read",
      },
      {
        name: "Sampling Routes",
        icon: "solar:database-bold-duotone",
        path: "/sampling-routes",
        permission: "sampling_routes:read",
      },
    ],
  },

  {
    label: "Organizations",
    children: [
      {
        name: "Organizations",
        icon: "solar:buildings-2-bold-duotone",
        path: "/organizations",
        permission: "organizations:read",
      },
      {
        name: "Departments",
        icon: "solar:buildings-2-bold-duotone",
        path: "/departments",
        permission: "organizations:read",
      },
      {
        name: "Sites",
        icon: "solar:buildings-2-bold-duotone",
        path: "/sites",
        permission: "sites:read",
      },
    ],
  },
  {
    label: "User Management",
    children: [
      {
        name: "Users",
        icon: "solar:users-group-two-rounded-bold-duotone",
        path: "/user-management",
        permission: "users:read",
      },
      {
        name: "Roles",
        icon: "solar:users-group-two-rounded-bold-duotone",
        path: "/roles",
        permission: "roles:read",
      },
    ],
  },
];

export default menuItems;
