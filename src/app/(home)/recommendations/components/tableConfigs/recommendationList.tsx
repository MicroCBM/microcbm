"use client";

import { Icon } from "@/libs";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  Text,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import type { CsvHeader, SessionUser } from "@/types";
import dayjs from "dayjs";
import { Recommendation, Sites, Asset } from "@/types";

interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface RecommendationListColumnsProps<
  T extends Recommendation = Recommendation
> {
  sites: Sites[];
  assets: Asset[];
  users: UserType[];
  currentUser?: SessionUser | null;
  onViewRecommendation: (recommendation: T) => void;
  onEditRecommendation: (recommendation: T) => void;
  onDeleteRecommendation: (recommendation: T) => void;
}

export function getRecommendationListColumns<
  T extends Recommendation = Recommendation
>({
  sites,
  assets,
  users,
  currentUser,
  onViewRecommendation,
  onEditRecommendation,
  onDeleteRecommendation,
}: RecommendationListColumnsProps<T>): ColumnDef<T>[] {
  return [
    {
      id: "title",
      header: "Title & Description",
      cell: ({ row }) => {
        const { title, description } = row.original;
        return (
          <div className="flex flex-col  gap-1">
            <span className="text-sm text-gray-900 font-medium">{title}</span>
            {description && (
              <p className="text-sm text-gray-500 truncate max-w-[200px] block">
                {description}
              </p>
            )}
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "site",
      header: "Site",
      cell: ({ row }) => {
        // find the site name from the sites array
        const site = sites.find(
          (site: Sites) => site.id === row.original.site?.id
        );
        return (
          <span className="text-sm text-gray-900">
            {site?.name || site?.id || "-"}
          </span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "asset",
      header: "Asset",
      cell: ({ row }) => {
        // find the asset name from the assets array
        const asset = assets.find(
          (asset: Asset) => asset.id === row.original.asset?.id
        );
        return (
          <span className="text-sm text-gray-900">
            {asset?.name || asset?.id || "-"}
          </span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "recommender",
      header: "Recommender",
      cell: ({ row }) => {
        const recommenderObj = row.original.recommender;

        // Check if the recommender ID matches the current logged-in user
        if (
          currentUser?.user_id &&
          recommenderObj?.id === currentUser.user_id
        ) {
          // Try to find the current user in the users array to get their name
          const currentUserInList = users.find(
            (user) => user.id === currentUser.user_id
          );
          const currentUserName =
            currentUserInList?.first_name || currentUserInList?.last_name
              ? `${currentUserInList.first_name || ""} ${
                  currentUserInList.last_name || ""
                }`.trim()
              : null;
          if (currentUserName) {
            return (
              <span className="text-sm text-gray-900 font-medium">
                You ({currentUserName})
              </span>
            );
          }
          return <span className="text-sm text-gray-900 font-medium">You</span>;
        }

        // Type guard for recommender with user fields
        type RecommenderWithUserFields = {
          id: string;
          name?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
        };

        const recommenderWithFields =
          recommenderObj as RecommenderWithUserFields;

        // First, check if recommender object has a name field (from type definition)
        if (recommenderWithFields?.name) {
          return (
            <span className="text-sm text-gray-900">
              {recommenderWithFields.name}
            </span>
          );
        }

        // Then check if recommender object has first_name or last_name directly
        // (the recommender object might be a full user object embedded)
        if (
          recommenderWithFields?.first_name ||
          recommenderWithFields?.last_name
        ) {
          const fullName = `${recommenderWithFields.first_name || ""} ${
            recommenderWithFields.last_name || ""
          }`.trim();
          if (fullName) {
            return <span className="text-sm text-gray-900">{fullName}</span>;
          }
        }

        // Finally, try to find the user in the users array by ID
        if (recommenderObj?.id) {
          const user = users.find((user) => user.id === recommenderObj.id);
          if (user) {
            const fullName =
              user.first_name || user.last_name
                ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                : null;
            if (fullName) {
              return <span className="text-sm text-gray-900">{fullName}</span>;
            }
          }
        }

        // Fallback to showing email if available
        if (recommenderWithFields?.email) {
          return (
            <span className="text-sm text-gray-900">
              {recommenderWithFields.email}
            </span>
          );
        }

        return <span className="text-sm text-gray-900">-</span>;
      },
      size: 150,
    },
    {
      accessorKey: "created_at_datetime",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {dayjs(row.original.created_at_datetime).format("MMM D, YYYY HH:mm")}
        </span>
      ),
      size: 180,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <StatusBadge
          status={
            row.original.severity as
              | "Active"
              | "Inactive"
              | "Pending"
              | "Low"
              | "Medium"
              | "High"
          }
        />
      ),
      size: 120,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="small">
                <Icon
                  icon="mdi:dots-vertical"
                  className="w-4 h-4 text-gray-600"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="px-4 py-2 bg-black text-white">
                <Text variant="span">Select an option</Text>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                  onClick={() => onViewRecommendation(row.original)}
                >
                  View Recommendation
                </button>
                <button
                  onClick={() => onEditRecommendation(row.original)}
                  className="flex items-center gap-2 px-3 py-2  rounded text-sm border-b border-gray-200 hover:bg-gray-100"
                >
                  Edit Recommendation
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
                  onClick={() => onDeleteRecommendation(row.original)}
                >
                  Delete Recommendation
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      size: 80,
    },
  ];
}

export const recommendationListCsvHeaders: Array<CsvHeader> = [
  {
    name: "Title",
    accessor: "title",
  },
  {
    name: "Description",
    accessor: "description",
  },
  {
    name: "Site",
    accessor: "site.name",
  },
  {
    name: "Asset",
    accessor: "asset.name",
  },
  {
    name: "Recommender",
    accessor: "recommender.name",
  },
  {
    name: "Created",
    accessor: "created_at_datetime",
  },
  {
    name: "Severity",
    accessor: "severity",
  },
];
