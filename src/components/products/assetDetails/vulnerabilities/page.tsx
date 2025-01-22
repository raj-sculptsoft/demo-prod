import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { VULNERABILITY_DETAILS_SOURCE } from "@/lib/common";
import { resetCurrentAsset } from "@/store/assets/slice";
import { getVulnerabilityStats } from "@/store/vulnerabilities/api";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import VulnerabilitiesPageClient from "../../../core/vulnerabilities/vulnerabilities-page";
import Layout from "./layout";

export default function AssetVulnerabilitiesPage({
  source,
}: {
  source: VULNERABILITY_DETAILS_SOURCE;
}) {
  const dispatch = useAppDispatch();
  const { assetId, productId } = useParams();

  const { loading, data } = useAppSelector(
    ({ vulnerability }) => vulnerability.stats,
  );

  useEffect(() => {
    if (assetId) {
      dispatch(getVulnerabilityStats(assetId));
    }
  }, [assetId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentAsset());
    };
  }, [dispatch]);

  return (
    <Layout
      params={{ assetId: assetId ?? "", productId: productId ?? "" }}
      children={
        <VulnerabilitiesPageClient
          loading={loading}
          data={data}
          source={source}
        />
      }
    />
  );
}
