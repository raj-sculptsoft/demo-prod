import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getProduct } from "@/store/products/api";
import React, { useEffect } from "react";
import FilterSearch from "../../core/filter/filter-search";
import Filters from "../../core/filter/filters";
import Header from "../../layout/header";
import AddAsset from "./_components/add-asset";
import AssetForm from "./_components/asset-form";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { productId: string };
}) {
  const dispatch = useAppDispatch();
  const { productId } = params;

  const { data } = useAppSelector(({ products }) => products.currentProduct);

  useEffect(() => {
    if (productId) {
      dispatch(getProduct(productId)); // Fetch product details when productId changes
    }
  }, [productId]);

  return (
    <>
      <Header
        nodes={[
          {
            name: data?.product_name || "",
            href: "/products",
          },
          { name: "Assets", href: `/product/${productId}/assets` },
        ]}
      >
        <Filters className="flex justify-between px-4 py-3">
          <AddAsset />
          <FilterSearch name="assetSearch" />
        </Filters>
      </Header>
      {children}
      <AssetForm />
    </>
  );
}
