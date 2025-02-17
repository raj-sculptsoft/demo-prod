import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getAsset } from "@/store/assets/api";
import React from "react";
import { useLocation } from "react-router-dom";
import FilterIcon from "../../../core/filter/filter-icon";
import FilterSearch from "../../../core/filter/filter-search";
import FilterSelect from "../../../core/filter/filter-select";
import FilterSeparator from "../../../core/filter/filter-separator";
import Filters from "../../../core/filter/filters";
import ResetFilter from "../../../core/filter/reset-filter";
import Header from "../../../layout/header";

interface Props {
  children: React.ReactNode;
  params: { assetId: string; productId: string };
}

export default function Layout({ children, params }: Props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const hasFiltersApplied = queryParams.get("type") === "True";

  const dispatch = useAppDispatch();
  const { data: assetData } = useAppSelector(
    (state) => state.assets.currentAsset,
  );

  const { assetId, productId } = params;

  React.useEffect(() => {
    if (assetId) {
      dispatch(getAsset(assetId));
    }
  }, [assetId, dispatch]);

  return (
    <>
      <Header
        nodes={[
          {
            name: assetData?.products?.product_name || "",
            href: "/products",
          },
          {
            name: assetData?.asset_name || "",
            href: `/product/${productId}/assets`,
          },
          {
            name: "Vulnerabilities",
            href: `/product/${productId}/asset/${assetId}/vulnerabilities`,
          },
        ]}
      >
        <Filters>
          <FilterIcon />
          <div>
            <FilterSeparator />
          </div>
          <FilterSelect
            placeholder="Select Type"
            defaultValue="False"
            options={[
              { label: "False Positive", value: "False" },
              { label: "True Positive", value: "True" },
            ]}
            value="False"
            name="type"
          />
          <div>
            <FilterSeparator />
          </div>
          {hasFiltersApplied && <ResetFilter />}
          <div className="ml-auto basis-96 p-2">
            <FilterSearch name="productSearch" />
          </div>
        </Filters>
      </Header>
      {children}
    </>
  );
}
