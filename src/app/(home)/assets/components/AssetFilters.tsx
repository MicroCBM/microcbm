import { Button } from "@/components";
import { Dropdown } from "@/components/dropdown";
import { useUrlState } from "@/hooks";
import { Icon } from "@/libs";
import { ASSET_STATUSES } from "@/utils";
import React from "react";
import { Sites } from "@/types";

export function AssetFilters({ sites }: { sites: Sites[] }) {
  const [severity, setSeverity] = useUrlState("criticality_level", "");
  const [site_id, setSearchSiteId] = useUrlState("site_id", "");

  const selectedSite = React.useMemo(() => {
    return sites.find((site) => site.id === site_id);
  }, [sites, site_id]);

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        actions={[
          ...ASSET_STATUSES.map((status) => ({
            label: status.label,
            onClickFn: () => setSeverity(status.value),
          })),
        ]}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          variant="outline"
          size="medium"
          className="border border-gray-100 group"
        >
          <Icon
            icon="hugeicons:plus-sign-circle"
            className="text-black size-4 group-hover:text-white"
          />
          {severity || "Filter by severity"}
        </Button>
      </Dropdown>
      <Dropdown
        actions={[
          {
            label: "All",
            onClickFn: () => setSearchSiteId(""),
          },
          ...sites.map((site) => ({
            label: site.name,
            onClickFn: () => setSearchSiteId(site.id),
          })),
        ]}
        contentClassName="absolute top-[-36px] right-[2px]"
      >
        <Button
          variant="outline"
          size="medium"
          className="border border-gray-100 group"
        >
          <Icon
            icon="hugeicons:plus-sign-circle"
            className="text-black size-4 group-hover:text-white"
          />
          {selectedSite?.name || "Filter by site"}
        </Button>
      </Dropdown>
    </div>
  );
}
