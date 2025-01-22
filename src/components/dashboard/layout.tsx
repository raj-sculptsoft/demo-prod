import React from "react";
import { useLocation } from "react-router-dom";
import DynamicFilterSelect from "../../components/core/filter/dynamic-filter-select";
import FilterIcon from "../../components/core/filter/filter-icon";
import FilterSeparator from "../../components/core/filter/filter-separator";
import Filters from "../../components/core/filter/filters";
import ResetFilter from "../../components/core/filter/reset-filter";
import Header from "../../components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const hasFiltersApplied =
    queryParams.has("product") || queryParams.has("asset");

  return (
    <>
      <Header nodes={[{ name: "Dashboard", href: "/dashboard" }]}>
        <Filters>
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
          {hasFiltersApplied && <ResetFilter />}
        </Filters>
      </Header>
      {children}
    </>
  );
}
