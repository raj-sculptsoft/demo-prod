import React from "react";
import FilterSearch from "../../components/core/filter/filter-search";
import Filter from "../../components/core/filter/filters";
import Header from "../../components/layout/header";
import AddProduct from "./_components/add-product";
import ProductForm from "./_components/product-form";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header nodes={[{ name: "Products", href: "/products" }]}>
        <Filter className="flex justify-between px-4 py-3">
          <AddProduct />
          <FilterSearch name="productSearch" />
        </Filter>
      </Header>
      {children}
      <ProductForm />
    </>
  );
}
