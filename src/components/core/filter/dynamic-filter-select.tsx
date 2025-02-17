import FilterSelect from "@/components/core/filter/filter-select";
import FilterSeparator from "@/components/core/filter/filter-separator";
import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import {
  defaultPayloadForWithoutPagination,
  getSelectOptions,
} from "@/lib/common";
import { getAllProducts, getAssetsByProduct } from "@/store/common/api";
import { clearAsset } from "@/store/common/slice";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface DynamicFilterSelectProps {
  productName: string;
  assetName: string;
  productPlaceholder: string;
  assetPlaceholder: string;
}

export default function DynamicFilterSelect({
  productName,
  assetName,
  productPlaceholder,
  assetPlaceholder,
}: DynamicFilterSelectProps) {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the product and asset from URL query params
  const productId = searchParams.get("product");
  const assetId = searchParams.get("asset");

  // Redux state
  const { loading: productsLoading, data: { list: productsList = [] } = {} } =
    useAppSelector((state) => state.common.products);
  const { loading: assetsLoading, data: { list: assetsList = [] } = {} } =
    useAppSelector((state) => state.common.assets);

  // Fetch products on mount
  useEffect(() => {
    dispatch(
      getAllProducts({
        company_id: config.COMPANY_ID,
        ...defaultPayloadForWithoutPagination,
      }),
    );
  }, [dispatch]);

  // Fetch assets for the selected product (if any)
  useEffect(() => {
    if (productId) {
      dispatch(
        getAssetsByProduct({
          product_id: productId,
          ...defaultPayloadForWithoutPagination,
        }),
      );
    }
  }, [dispatch, productId]);

  // Sort lists using useMemo to avoid unnecessary re-sorting
  const sortedProductsList = useMemo(() => {
    if (!productsList?.length) return [];
    return [...productsList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [productsList]);

  const sortedAssetsList = useMemo(() => {
    if (!assetsList?.length) return [];
    return [...assetsList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [assetsList]);

  // Truncate name if it's longer than 30 characters
  const truncateName = (name: string) =>
    name?.length > 30 ? `${name.slice(0, 30)}...` : name;

  return (
    <>
      {/* Product Select */}
      <FilterSelect
        name={productName}
        placeholder={
          productsLoading
            ? ""
            : sortedProductsList.length > 0
              ? productPlaceholder
              : "No Product"
        }
        options={[
          { label: "All Products", value: "all" },
          ...(sortedProductsList.length > 0
            ? getSelectOptions(
                sortedProductsList.map((product) => ({
                  ...product,
                  product_name: truncateName(product.product_name),
                })),
                "product_name",
                "product_id",
              )
            : []),
        ]}
        isLoading={productsLoading}
        disabled={sortedProductsList.length === 0}
        value={productId || ""}
        onValueChange={(value) => {
          const newParams = new URLSearchParams(searchParams);

          if (value === "all") {
            newParams.delete("product");
            newParams.delete("asset");
            dispatch(clearAsset());
            setSearchParams(newParams);
            navigate(`?${newParams.toString()}`, { replace: true });
            window.location.reload();
          } else {
            newParams.set("product", value);
            newParams.delete("asset");
            dispatch(clearAsset());
            setSearchParams(newParams);
            navigate(`?${newParams.toString()}`);
          }
        }}
      />

      <div>
        <FilterSeparator />
      </div>

      {/* Asset Select */}
      <FilterSelect
        name={assetName}
        placeholder={
          productsLoading || assetsLoading
            ? ""
            : productsList.length > 0
              ? productId
                ? assetsList.length > 0
                  ? assetPlaceholder
                  : "No Asset"
                : assetPlaceholder
              : "No Asset"
        }
        options={[
          { label: "All Assets", value: "all" },
          ...(sortedAssetsList.length > 0
            ? getSelectOptions(
                sortedAssetsList.map((asset) => ({
                  ...asset,
                  asset_name: truncateName(asset.asset_name),
                })),
                "asset_name",
                "asset_id",
              )
            : []),
        ]}
        isLoading={productsLoading || assetsLoading}
        disabled={!productId || sortedAssetsList.length === 0}
        value={assetId || ""}
        onValueChange={(value) => {
          const newParams = new URLSearchParams(searchParams);

          if (value === "all") {
            newParams.delete("asset");
            setSearchParams(newParams);
            navigate(`?${newParams.toString()}`, { replace: true });
          } else {
            newParams.set("asset", value);
            setSearchParams(newParams);
            navigate(`?${newParams.toString()}`);
          }
        }}
      />
    </>
  );
}
