"use client";

import { cn } from "@/libs";
import { PaginatedTable, Text } from "@/components";
import { Recommendation, Sites, Asset } from "@/types";
import {
  ViewRecommendationModal,
  DeleteRecommendationModal,
  EditRecommendationModal,
} from "./modals";
import {
  getRecommendationListColumns,
  recommendationListCsvHeaders,
} from "./tableConfigs";
import { useRecommendationManagementBase } from "../hooks";
import { MODALS } from "@/utils/constants/modals";
import { useContentGuard } from "@/hooks";

interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface RecommendationTableProps {
  data: Recommendation[];
  className?: string;
  sites?: Sites[];
  assets?: Asset[];
  users?: UserType[];
}

export function RecommendationTable({
  data,
  className,
  sites = [],
  assets = [],
  users = [],
}: RecommendationTableProps) {
  const { modal, query, setQuery } = useRecommendationManagementBase();
  const { user: currentUser } = useContentGuard();

  const handleViewRecommendation = (recommendation: Recommendation) => {
    modal.openModal(MODALS.RECOMMENDATION.CHILDREN.VIEW, { recommendation });
  };

  const handleEditRecommendation = (recommendation: Recommendation) => {
    modal.openModal(MODALS.RECOMMENDATION.CHILDREN.EDIT, { recommendation });
  };

  const handleDeleteRecommendation = (recommendation: Recommendation) => {
    modal.openModal(MODALS.RECOMMENDATION.CHILDREN.DELETE, { recommendation });
  };

  const recommendationListColumns = getRecommendationListColumns({
    sites,
    assets,
    users,
    currentUser,
    onViewRecommendation: handleViewRecommendation,
    onEditRecommendation: handleEditRecommendation,
    onDeleteRecommendation: handleDeleteRecommendation,
  });

  console.log("data recommendations", data);

  return (
    <div className={cn("relative space-y-[37px]", className)}>
      <div className="text-[#0c4b77] py-2 border-b-2 border-[#0c4b77] w-fit">
        <Text variant="h6" weight="medium">
          Recommendations ({data?.length ?? 0})
        </Text>
      </div>
      <PaginatedTable<Recommendation>
        filterWrapperClassName="lg:absolute lg:top-0 lg:right-[2px]"
        columns={recommendationListColumns}
        data={data}
        query={query}
        setQuery={setQuery}
        total={data?.length ?? 0}
        loading={false}
        csvHeaders={recommendationListCsvHeaders}
        searchPlaceholder="Search recommendations"
        noExport
      />

      <ViewRecommendationModal />
      <DeleteRecommendationModal />
      <EditRecommendationModal />
    </div>
  );
}
