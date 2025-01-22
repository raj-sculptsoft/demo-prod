import { VULNERABILITY_DETAILS_SOURCE } from "@/lib/common";
import { DashboardStats } from "@/types/dashboard";
import { VulnerabilityCounts } from "@/types/vulnerability";
import React from "react";
import VulnerabilitiesList from "../../../components/core/vulnerabilities/vulnerabilities-list";
import VulnerabilitiesStats from "../../../components/core/vulnerabilities/vulnerabilities-stats";
import CardSkeleton from "../../../components/skeleton/card";

export default function VulnerabilitiesPageClient({
  loading,
  data,
  source,
}: {
  loading: boolean;
  data: VulnerabilityCounts | DashboardStats;
  source: VULNERABILITY_DETAILS_SOURCE;
}) {
  return (
    <React.Fragment>
      {loading ? (
        <div className="mb-4">
          <CardSkeleton wrapperClassName="gap-3 lg:grid-cols-5" cardCount={5} />
        </div>
      ) : (
        <VulnerabilitiesStats data={data} />
      )}
      <VulnerabilitiesList source={source} />
    </React.Fragment>
  );
}
