import { useAppSelector } from "@/hooks/use-store";
import { DashboardTopVulnerabilityList } from "@/types/dashboard";
import SummaryCardWrapper from "../summary-card-wrapper";
import Graph from "./graph";
import TopVulnerableAssets from "./top-vulnerable-assets";

export default function TopVulnerableProducts() {
  const { data } = useAppSelector(
    ({ dashboard }) => dashboard.topVulnerability,
  );

  const firstItem = data?.list?.[0];
  let title = "Top Vulnerabilities";

  if (firstItem?.product_name) {
    title = "Top Vulnerable Products";
  } else if (firstItem?.asset_name) {
    title = "Top Vulnerable Assets";
  }

  // Ensure data has a valid structure
  const safeData: DashboardTopVulnerabilityList = {
    list: data?.list || [],
  };

  return (
    <SummaryCardWrapper title={title}>
      <Graph hasChildTooltip={false} data={safeData} />
      <TopVulnerableAssets data={safeData} />
    </SummaryCardWrapper>
  );
}
