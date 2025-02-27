import config from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getProductStats } from "@/store/products/api";
import { useEffect } from "react";
import CardSkeleton from "../../components/skeleton/card";
import ProductsList from "./_components/products-list";
import Stats from "./_components/stats";
import Layout from "./layout";

export default function Products() {
  const company_id = config.COMPANY_ID;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(({ products }) => products.stats);

  // Fetch product statistics when company_id is available
  useEffect(() => {
    if (company_id) {
      dispatch(getProductStats(company_id));
    }
  }, [company_id]);

  return (
    <Layout>
      {loading ? (
        <div className="mb-4">
          <CardSkeleton /> {/* Show loading skeleton while fetching stats */}
        </div>
      ) : (
        <Stats /> // Display product stats once loading is complete
      )}
      <ProductsList /> {/* Render the list of products */}
    </Layout>
  );
}
