import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import {
  getDashboardRiskMatrix,
  getDashboardTopVulnerability,
  getDashboardVulnerabilities,
  getDashboardVulnerabilityDetails,
} from "@/store/dashboard/api";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "../../../../components/ui/skeleton";
import RiskMatrix from "./risk-matrix";
import TopVulnerabilities from "./top-vulnerabilities";
import TopVulnerableProducts from "./top-vulnerable/top-vulnerable-products";
import Vulnerabilities from "./vulnerabilities/vulnerabilities";

interface SummaryProps {
  company_id: string;
}

export default function Summary({ company_id }: SummaryProps) {
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product") ?? "";
  const asset_id = searchParams.get("asset") ?? "";
  const dispatch = useAppDispatch();
  const riskMatrixLoading = useAppSelector(
    ({ dashboard }) => dashboard.riskMatrix.loading,
  );
  const vulnerabilityDetailsLoading = useAppSelector(
    ({ dashboard }) => dashboard.vulnerabilityDetails.loading,
  );
  const vulnerabilitiesLoading = useAppSelector(
    ({ dashboard }) => dashboard.vulnerabilities.loading,
  );
  const topVulnerabilityLoading = useAppSelector(
    ({ dashboard }) => dashboard.topVulnerability.loading,
  );

  useEffect(() => {
    dispatch(
      getDashboardRiskMatrix({
        company_id,
        product_id,
        asset_id,
      }),
    ).unwrap();
  }, [company_id, product_id, asset_id, dispatch]);

  useEffect(() => {
    dispatch(
      getDashboardVulnerabilities({
        company_id,
        product_id,
        asset_id,
      }),
    ).unwrap();
  }, [company_id, product_id, asset_id, dispatch]);

  useEffect(() => {
    dispatch(
      getDashboardVulnerabilityDetails({ company_id, product_id, asset_id }),
    );
  }, [company_id, product_id, asset_id, dispatch]);

  useEffect(() => {
    dispatch(
      getDashboardTopVulnerability({ company_id, product_id, asset_id }),
    ).unwrap();
  }, [company_id, product_id, asset_id, dispatch]);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {topVulnerabilityLoading ? (
        <Skeleton className="h-[477px]" isLoadingText={true} />
      ) : (
        <TopVulnerableProducts />
      )}

      {vulnerabilityDetailsLoading ? (
        <Skeleton className="h-[477px]" isLoadingText={true} />
      ) : (
        <TopVulnerabilities />
      )}

      {vulnerabilitiesLoading ? (
        <Skeleton className="h-[477px]" isLoadingText={true} />
      ) : (
        <Vulnerabilities />
      )}

      {riskMatrixLoading ? (
        <Skeleton className="h-[477px]" isLoadingText={true} />
      ) : (
        <RiskMatrix />
      )}
    </div>
  );
}
