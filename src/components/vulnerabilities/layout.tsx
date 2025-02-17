import DynamicFilterSelect from "@/components/core/filter/dynamic-filter-select";
import FilterIcon from "@/components/core/filter/filter-icon";
import FilterSearch from "@/components/core/filter/filter-search";
import FilterSelect from "@/components/core/filter/filter-select";
import FilterSeparator from "@/components/core/filter/filter-separator";
import Filters from "@/components/core/filter/filters";
import ResetFilter from "@/components/core/filter/reset-filter";
import Header from "@/components/layout/header";
import { useAppSelector } from "@/hooks/use-store";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const isTypeTrue = queryParams.get("type") === "True";
  const hasFiltersApplied =
    queryParams.has("product") || queryParams.has("asset") || isTypeTrue;

  const { data: reportData } = useAppSelector(
    (state) => state.uploadReport.reportStatus,
  );
  const { reportId } = useAppSelector((state) => state.uploadReport);

  const statusId = useAppSelector((state) => state.synk.statusId);
  const { data: statusReportData } = useAppSelector(
    (state) => state.synk.statusReport,
  );

  const [showProcessingMessage, setShowProcessingMessage] = useState(false);

  useEffect(() => {
    // Show processing message if report is in progress and reportId exists
    if (
      (reportData.status === "In Progress" && reportId) ||
      (statusReportData.status === "In Progress" && statusId)
    ) {
      setShowProcessingMessage(true);
    } else {
      setShowProcessingMessage(false);
    }
  }, [reportData, statusReportData, reportId, statusId]);

  return (
    <>
      <Header nodes={[{ name: "Vulnerabilities", href: "/vulnerabilities" }]}>
        {showProcessingMessage && (
          <div className="mx-auto mb-4 w-[1000px] bg-primary p-1 text-center text-white">
            <div className="flex items-center justify-center gap-2">
              <div className="mr-2 h-3 w-3 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              <span>
                Processing vulnerabilities. Results update as data comes in.
                Progress won't show if you refresh, filter, or change. Please
                wait for analysis to finish.
              </span>
            </div>
          </div>
        )}

        <Filters className="item">
          <FilterIcon />
          <div>
            <FilterSeparator />
          </div>
          <DynamicFilterSelect
            productName="product"
            assetName="asset"
            productPlaceholder="All Products"
            assetPlaceholder="All Assets"
          />
          <div>
            <FilterSeparator />
          </div>
          <FilterSelect
            placeholder="Select Type"
            defaultValue="False"
            value="False"
            options={[
              { label: "False Positive", value: "False" },
              { label: "True Positive", value: "True" },
            ]}
            name="type"
          />
          <div>
            <FilterSeparator />
          </div>
          {hasFiltersApplied && <ResetFilter name="productSearch" />}
          <div className="ml-auto basis-96 self-center p-2">
            <FilterSearch name="productSearch" />
          </div>
        </Filters>
      </Header>
      {children}
    </>
  );
}
