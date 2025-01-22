import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { getAssetStats } from "@/store/assets/api";
import { resetStats } from "@/store/assets/slice";
import { resetCurrentProduct } from "@/store/products/slice";
import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Updated import
import CardSkeleton from "../../../components/skeleton/card";
import AssetsList from "./_components/assets-list";
import Stats from "./_components/stats";
import Layout from "./layout";

export default function AssetsFromProduct() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector(({ assets }) => assets.stats);

  useEffect(() => {
    if (productId) {
      dispatch(getAssetStats(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetStats());
      dispatch(resetCurrentProduct());
    };
  }, [dispatch]);

  return (
    <Layout
      params={{ productId: productId ?? "" }}
      children={
        <>
          {loading ? (
            <div className="mb-4">
              <CardSkeleton />
            </div>
          ) : (
            <Stats />
          )}
          <AssetsList />
        </>
      }
    />
  );
}
